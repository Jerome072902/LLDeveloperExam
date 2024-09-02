import React, { useState, useEffect, useRef } from "react";
import ReactToPrint from "react-to-print";
import { Link as RouterLink } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  TablePagination,
  Grid,
  Skeleton,
} from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import { Search } from "@mui/icons-material";

import FilterAltIcon from "@mui/icons-material/FilterAlt";

import CloseIcon from "@mui/icons-material/Close";
import AddMeet from "./AddMeet";
// import EditMeet from "./EditMeet";

import {
  startOfDay,
  endOfDay,
  parseISO,
  isWithinInterval,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  isSameDay,
  format,
} from "date-fns";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Popover from "@mui/material/Popover";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Typography } from "@mui/material";
import FilesNone from "../../Components/Pictures/FilesNone.png";
import { faPrint, faEye } from "@fortawesome/free-solid-svg-icons";
import "./Minutes.css";
// import MeetingReports from "./MeetingReports";
import axios from "axios";

const columns = [
  { id: "title", label: "Title", hideOnMobile: false },
  { id: "venue", label: "Venue", hideOnMobile: false },
  { id: "date", label: "Date", hideOnMobile: false },

  { id: "action", label: "Action", hideOnMobile: false },
];

const MinOfMeeting = ({ darkMode }) => {
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [hoveredColumn, setHoveredColumn] = useState(null);
  const [meetingData, setMeetingData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [dense, setDense] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [isSticky, setIsSticky] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [id, setId] = useState(null);
  const [selectedFilterOption, setSelectedFilterOption] = useState("title");
  const [selectedTitleFilter, setSelectedTitleFilter] = useState("");
  const [selectedVenueFilter, setSelectedVenueFilter] = useState("");
  const [openVenuePopover, setOpenVenuePopover] = useState(false);
  const [anchorElVenue, setAnchorElVenue] = useState(null);
  const [openDatePopover, setOpenDatePopover] = useState(false);
  const [anchorElDate, setAnchorElDate] = useState(null);
  const [selectedDateFilter, setSelectedDateFilter] = useState(null);
  const [thisWeekFilter, setThisWeekFilter] = useState(false);
  const [thisMonthFilter, setThisMonthFilter] = useState(false);
  const [thisYearFilter, setThisYearFilter] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const componentRef = useRef();

  const navigate = useNavigate();

  // useEffect(() => {
  const fetchAllMeetings = async () => {
    try {
      const res = await axios.get("http://localhost:3333/minofmeet");
      setMeetingData(res.data);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };
  // const interval = setInterval(() => {
  fetchAllMeetings();
  // }, 5000);
  // return () => clearInterval(interval);
  // }, []);

  const toggleRowExpansion = (key) => {
    if (!["toggle", "action"].includes(key)) {
      setExpandedRows((prevState) => ({
        ...prevState,
        [key]: !prevState[key],
      }));
    }
  };

  const handleSort = (columnId, isFilterButton) => {
    if (!["toggle", "action"].includes(columnId) && !isFilterButton) {
      if (sortColumn === columnId) {
        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
      } else {
        setSortColumn(columnId);
        setSortOrder("asc");
      }
      setHoveredColumn(columnId);
    }
  };

  const filteredData = meetingData.filter((item) => {
    const meetingDate = parseISO(item.date);

    if (!meetingDate) {
      return false;
    }

    const searchMatches =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      format(meetingDate, "yyyy-MM-dd").includes(searchQuery.toLowerCase());

    const dateFilterMatches =
      selectedFilters.length === 0 ||
      selectedFilters.some((filter) => {
        return isWithinInterval(meetingDate, {
          start: startOfDay(filter),
          end: endOfDay(filter),
        });
      });

    const dateFilterMatch =
      !selectedDateFilter || isSameDay(meetingDate, selectedDateFilter);

    const thisWeekFilterMatch =
      !thisWeekFilter ||
      isWithinInterval(meetingDate, {
        start: startOfWeek(new Date()),
        end: endOfWeek(new Date()),
      });

    const thisMonthFilterMatch =
      !thisMonthFilter ||
      isWithinInterval(meetingDate, {
        start: startOfMonth(new Date()),
        end: endOfMonth(new Date()),
      });

    const thisYearFilterMatch =
      !thisYearFilter ||
      isWithinInterval(meetingDate, {
        start: startOfYear(new Date()),
        end: endOfYear(new Date()),
      });

    const titleFilterMatch =
      selectedTitleFilter === "" ||
      item.title.toLowerCase().includes(selectedTitleFilter.toLowerCase());

    const venueFilterMatch =
      selectedVenueFilter === "" ||
      item.venue.toLowerCase().includes(selectedVenueFilter.toLowerCase());

    return (
      searchMatches &&
      dateFilterMatches &&
      dateFilterMatch &&
      thisWeekFilterMatch &&
      thisMonthFilterMatch &&
      thisYearFilterMatch &&
      titleFilterMatch &&
      venueFilterMatch
    );
  });

  const sortedData = filteredData.slice().sort((a, b) => {
    if (sortColumn) {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];

      if (sortOrder === "asc") {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    }
    return 0;
  });

  const paginatedData = sortedData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleMeetingEdit = (editedMeeting) => {
    setIsEditModalOpen(false);
  };

  const cancel = () => {};
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const rowsPerPageOptions = [8, 16, 32];

  useEffect(() => {
    const handleScroll = () => {
      const divElement = document.querySelector(".headr");
      const boundingBox = divElement.getBoundingClientRect();
      setIsSticky(boundingBox.top <= 0);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const [startDateFilter, setStartDateFilter] = useState("");

  const handleDeleteFilter = (filter) => {
    setStartDateFilter("");
    setSelectedFilters((prevFilters) =>
      prevFilters.filter((f) => f !== filter)
    );
    if (selectedFilters.length === 1) {
      setSelectedFilterOption("");
    }
  };

  const updateScreenWidth = () => {
    setScreenWidth(window.innerWidth);
  };

  useEffect(() => {
    const handleResize = () => {
      updateScreenWidth();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const handleCloseVenuePopover = () => {
    setOpenVenuePopover(false);
  };

  const handlePopoverVenueChange = (e) => {
    setSelectedVenueFilter(e.target.value);
  };

  const handleOpenDatePopover = (event) => {
    setOpenDatePopover(true);
    setAnchorElDate(event.currentTarget);
  };

  const handleCloseDatePopover = () => {
    setOpenDatePopover(false);
  };
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div className="min-h-screen">
          <div
            className={`mt-2 px-4 py-4 justify-between items-center inset-0 sticky scroll-pt-4 z-10 headr ${
              isSticky
                ? "bg-white border-b-2 border-slate-300 dark:border-slate-300/10 dark:bg-slate-900"
                : ""
            }`}
          >
            <header className="font-bold ml-4 lg:text-2xl sm:text-xl">
              Minutes of the Meeting
            </header>
            <AddMeet />
          </div>
          <div className="mx-8">
            <div className="flex sm:flex-row flex-col sm:justify-between ">
              <div></div>
              <div className="flex  gap-2 ">
                <ReactToPrint
                  trigger={() => (
                    <button
                      className="p-3 sm:p-2 h-fit  flex items-center self-center bg-gray-400 text-white rounded-sm "
                      onClick={() => setIsPrintDialogOpen(true)}
                    >
                      <FontAwesomeIcon
                        icon={faPrint}
                        className="text-base pr-0 sm:pr-2 self-center sm:self-auto"
                      />
                      <span className="hidden sm:block">Print</span>
                    </button>
                  )}
                  content={() => componentRef.current}
                />
                <div className="search-container dark:text-slate-400 dark:bg-slate-900 dark:border-slate-300/10 search-box">
                  <Search className="search-icon dark:text-slate-400" />
                  <input
                    id="searchzr"
                    type="text"
                    placeholder="Search"
                    s
                    autoComplete="off"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input dark:bg-slate-900 focus:placeholder-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="minutes_container">
            <div className="mx-2 sm:mx-10 mt-3 print:shadow-transparent mb-3 dark:border-slate-300/10 table-scroll rounded-md">
              <div className="bg-white dark:bg-slate-800 rounded-md">
                <div className=" shadow-md  p-2 sm:p-6 h-fit ">
                  {isLoading ? (
                    <div>
                      <Skeleton variant="text" width="100%" height={40} />
                      <Skeleton variant="text" width="100%" height={40} />
                      <Skeleton variant="text" width="100%" height={40} />
                    </div>
                  ) : (
                    <Grid className="table-scroll pl-2">
                      <TableContainer sx={{ height: "800px" }}>
                        <div className="overflow-y-auto">
                          <Table
                            className=""
                            sx={{ border: "unset" }}
                            size={dense ? "small" : "medium"}
                          >
                            <TableHead>
                              <TableRow className="whitespace-nowrap">
                                <TableCell
                                  className={`dark:text-slate-400 dark:border-b-slate-300/10 `}
                                  style={{
                                    fontWeight: "bold",
                                    cursor: "pointer",
                                  }}
                                  onClick={(event) => {
                                    handleSort("title", true);
                                    setAnchorEl(event.currentTarget);
                                    setOpen(!open);
                                    setId(id);
                                  }}
                                  onMouseEnter={() => setHoveredColumn("title")}
                                  onMouseLeave={() => setHoveredColumn(null)}
                                >
                                  Title
                                  <button className="">
                                    <FilterAltIcon />
                                  </button>
                                  <Popover
                                    id={id}
                                    open={open}
                                    anchorEl={anchorEl}
                                    onClose={handleClose}
                                    className=""
                                    anchorOrigin={{
                                      vertical: "bottom",
                                      horizontal: "left",
                                    }}
                                  >
                                    <div className="flex flex-col p-4">
                                      <div className="search-container dark:text-slate-400 dark:border-slate-300/50">
                                        <FilterAltIcon className="search-icon dark:text-slate-400" />
                                        <input
                                          id="searchzrz"
                                          type="text"
                                          placeholder={`Filter Meeting ${selectedFilterOption}`}
                                          autoComplete="off"
                                          onClick={(e) => e.stopPropagation()}
                                          className="search-input  focus:placeholder-transparent dark:text-slate-600"
                                          value={selectedTitleFilter}
                                          onChange={(e) =>
                                            setSelectedTitleFilter(
                                              e.target.value
                                            )
                                          }
                                        />
                                        {selectedTitleFilter && (
                                          <CloseIcon
                                            className="cursor-pointer"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setSelectedTitleFilter("");
                                            }}
                                          />
                                        )}
                                      </div>
                                      <div>
                                        <div className="overflow-y-auto h-40">
                                          {meetingData
                                            .filter((meeting) =>
                                              meeting.title
                                                .toLowerCase()
                                                .includes(
                                                  selectedTitleFilter.toLowerCase()
                                                )
                                            )
                                            .map((meeting) => (
                                              <option
                                                className="cursor-pointer hover:bg-slate-100"
                                                key={meeting.key}
                                                value={meeting.title}
                                                selected={
                                                  meeting.title ===
                                                  selectedTitleFilter
                                                }
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  setSelectedTitleFilter(
                                                    meeting.title
                                                  );
                                                }}
                                              >
                                                {meeting.title}
                                              </option>
                                            ))}
                                          {meetingData.filter((meeting) =>
                                            meeting.title
                                              .toLowerCase()
                                              .includes(
                                                selectedTitleFilter.toLowerCase()
                                              )
                                          ).length === 0 && (
                                            <div className="text-gray-500 p-2">
                                              <p> No meetings found.</p>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </Popover>
                                </TableCell>

                                <TableCell
                                  className={`dark:text-slate-400 dark:border-b-slate-300/10 `}
                                  style={{
                                    fontWeight: "bold",
                                    cursor: "pointer",
                                  }}
                                  onClick={(event) => {
                                    handleSort("venue", true);
                                    setAnchorElVenue(event.currentTarget);
                                    setOpenVenuePopover(!openVenuePopover);
                                  }}
                                  onMouseEnter={() => setHoveredColumn("venue")}
                                  onMouseLeave={() => setHoveredColumn(null)}
                                >
                                  Venue
                                  <button className="">
                                    <FilterAltIcon />
                                  </button>
                                  <Popover
                                    id={id}
                                    open={openVenuePopover}
                                    anchorEl={anchorElVenue}
                                    onClose={handleCloseVenuePopover}
                                    anchorOrigin={{
                                      vertical: "bottom",
                                      horizontal: "left",
                                    }}
                                  >
                                    <div className="flex flex-col p-4">
                                      <div className="search-container dark:text-slate-400 dark:border-slate-300/50">
                                        <FilterAltIcon className="search-icon dark:text-slate-400" />
                                        <input
                                          id="searchzrz"
                                          type="text"
                                          placeholder={`Filter Meeting Venue`}
                                          autoComplete="off"
                                          onClick={(e) => e.stopPropagation()}
                                          className="search-input focus:placeholder-transparent dark:text-slate-600"
                                          value={selectedVenueFilter}
                                          onChange={handlePopoverVenueChange}
                                        />
                                        {selectedVenueFilter && (
                                          <CloseIcon
                                            className="cursor-pointer"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setSelectedVenueFilter("");
                                            }}
                                          />
                                        )}
                                      </div>
                                      <div>
                                        <div className="overflow-y-auto h-40">
                                          {[
                                            ...new Set(
                                              meetingData.map(
                                                (meeting) => meeting.venue
                                              )
                                            ),
                                          ].map((venue) => (
                                            <option
                                              className="cursor-pointer hover:bg-slate-100"
                                              key={venue}
                                              value={venue}
                                              selected={
                                                venue === selectedVenueFilter
                                              }
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedVenueFilter(venue);
                                              }}
                                            >
                                              {venue}
                                            </option>
                                          ))}
                                          {meetingData.length === 0 && (
                                            <div className="text-gray-500 p-2">
                                              <p>No venues found.</p>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </Popover>
                                </TableCell>

                                <TableCell
                                  className={`dark:text-slate-400 dark:border-b-slate-300/10 `}
                                  style={{
                                    fontWeight: "bold",
                                    cursor: "pointer",
                                  }}
                                  onClick={(event) => {
                                    handleSort("date", true);
                                    handleOpenDatePopover(event);
                                  }}
                                  onMouseEnter={() => setHoveredColumn("date")}
                                  onMouseLeave={() => setHoveredColumn(null)}
                                >
                                  Date
                                  <button className="">
                                    <FilterAltIcon />
                                  </button>
                                  <Popover
                                    id={id}
                                    open={openDatePopover}
                                    anchorEl={anchorElDate}
                                    onClose={handleCloseDatePopover}
                                    onClick={(event) => {
                                      event.stopPropagation();
                                    }}
                                    anchorOrigin={{
                                      vertical: "bottom",
                                      horizontal: "left",
                                    }}
                                    disableRestoreFocus
                                  >
                                    <div className="flex flex-col p-4">
                                      <div className="flex items-center p-0 ">
                                        <FilterAltIcon className="search-icon dark:text-slate-400" />
                                        <DatePicker
                                          label="Filter Meeting Date"
                                          value={selectedDateFilter}
                                          onChange={(date) =>
                                            setSelectedDateFilter(date)
                                          }
                                          textfield={(params) => (
                                            <input
                                              {...params.inputProps}
                                              placeholder="Select date"
                                              className="dark:text-slate-400 dark:border dark:border-gray-300 dark:border-slate-300/10"
                                            />
                                          )}
                                        />
                                        {selectedDateFilter && (
                                          <CloseIcon
                                            className="cursor-pointer"
                                            onClick={() =>
                                              setSelectedDateFilter(null)
                                            }
                                          />
                                        )}
                                      </div>
                                      <div className="flex flex-col mt-2">
                                        <label>
                                          <input
                                            type="checkbox"
                                            className="w-4 h-4 mr-1"
                                            checked={thisWeekFilter}
                                            onChange={() =>
                                              setThisWeekFilter(!thisWeekFilter)
                                            }
                                          />
                                          <span>This Week</span>
                                        </label>
                                        <label>
                                          <input
                                            type="checkbox"
                                            className="w-4 h-4 mr-1"
                                            checked={thisMonthFilter}
                                            onChange={() =>
                                              setThisMonthFilter(
                                                !thisMonthFilter
                                              )
                                            }
                                          />
                                          <span>This Month</span>
                                        </label>
                                        <label>
                                          <input
                                            type="checkbox"
                                            className="w-4 h-4 mr-1"
                                            checked={thisYearFilter}
                                            onChange={() =>
                                              setThisYearFilter(!thisYearFilter)
                                            }
                                          />
                                          <span>This Year</span>
                                        </label>
                                      </div>
                                    </div>
                                  </Popover>
                                </TableCell>

                                <TableCell
                                  className={`dark:text-slate-400 dark:border-b-slate-300/10 `}
                                >
                                  Action
                                </TableCell>
                              </TableRow>
                            </TableHead>

                            <TableBody>
                              {filteredData.length === 0 ? (
                                <TableRow>
                                  <TableCell
                                    className="dark:text-slate-400 dark:border-b-0 border-b-0"
                                    colSpan={4}
                                    style={{ textAlign: "center" }}
                                    sx={{ border: "unset" }}
                                  >
                                    <div
                                      className="flex items-center justify-center"
                                      style={{ height: "700px" }}
                                    >
                                      <Typography
                                        variant="h6"
                                        className="dark:text-slate-400 flex flex-col items-center"
                                      >
                                        <img
                                          src={FilesNone}
                                          alt="Empty-Table"
                                          className="w-48 mr-10"
                                        />
                                        <div>No Meetings</div>
                                        <small className="text-gray-400">
                                          Add Meetings to be Archived
                                        </small>
                                      </Typography>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ) : (
                                paginatedData.map((meetingData) => (
                                  <React.Fragment key={meetingData.id}>
                                    <TableRow className="hover:bg-gray-100 dark:hover:bg-slate-700 hover:cursor-pointer group">
                                      {columns
                                        .filter(
                                          (column) =>
                                            column.id !== "" &&
                                            !(
                                              column.hideOnMobile &&
                                              screenWidth <= 768
                                            )
                                        )
                                        .map((column) => (
                                          <TableCell
                                            className={`dark:border-b-slate-300/10 overflow-clip ${
                                              screenWidth < 768
                                                ? "mobile-action-column"
                                                : ""
                                            }`}
                                            key={column.id}
                                            style={{
                                              fontSize:
                                                screenWidth < 768
                                                  ? "10px"
                                                  : "14px",
                                              whiteSpace: "nowrap",
                                            }}
                                          >
                                            {column.id === "action" ? (
                                              <>
                                                <div className="flex flex-row gap-3">
                                                  <Tooltip title="View Meeting">
                                                    <RouterLink
                                                      to={`/View-Meeting/${meetingData.id}`}
                                                      style={{
                                                        textDecoration: "none",
                                                      }}
                                                    >
                                                      <IconButton
                                                        edge="end"
                                                        className={`dark:text-slate-400 ${
                                                          screenWidth < 768
                                                            ? "MuiIconButton-sizeSmall"
                                                            : ""
                                                        }`}
                                                        aria-label="View"
                                                        style={{
                                                          outline: "none",
                                                        }}
                                                      >
                                                        <FontAwesomeIcon
                                                          icon={faEye}
                                                          className="text-base"
                                                        />
                                                      </IconButton>
                                                    </RouterLink>
                                                  </Tooltip>
                                                </div>
                                              </>
                                            ) : (
                                              <span
                                                className="dark:text-slate-400 text"
                                                style={{ fontWeight: "" }}
                                              >
                                                {meetingData[column.id]}
                                              </span>
                                            )}
                                          </TableCell>
                                        ))}
                                    </TableRow>
                                    <TableRow>
                                      <TableCell
                                        colSpan={columns.length}
                                        className="dark:border-b-slate-300/10"
                                        style={{
                                          paddingBottom: 0,
                                          paddingTop: 0,
                                        }}
                                      ></TableCell>
                                    </TableRow>
                                  </React.Fragment>
                                ))
                              )}
                            </TableBody>
                          </Table>
                        </div>
                      </TableContainer>
                    </Grid>
                  )}
                  <TablePagination
                    className={`dark:text-slate-400 dark:border-b-slate-300/10 `}
                    rowsPerPageOptions={rowsPerPageOptions}
                    component="div"
                    count={filteredData.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
                </div>
              </div>
              <div className="hidden print:block  bg-white" ref={componentRef}>
                {/* <MeetingReports data={paginatedData} ref={componentRef} /> */}
              </div>
            </div>
          </div>
          {/* EditMeet modal */}
          {selectedMeeting && (
            <EditMeet
              isOpen={isEditModalOpen}
              onClose={() => setIsEditModalOpen(false)}
              onSave={handleMeetingEdit}
              initialData={selectedMeeting}
            />
          )}
        </div>
      </LocalizationProvider>
    </>
  );
};

export default MinOfMeeting;
