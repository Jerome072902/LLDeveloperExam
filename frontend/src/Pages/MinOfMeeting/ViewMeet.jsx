import React, { useState, useEffect, useRef } from "react";
import {
  IconButton,
  Breadcrumbs,
  Link,
  Typography,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Link as MuiLink,
} from "@mui/material";
import { useParams, Link as RouterLink, useLocation } from "react-router-dom";
import {
  ExpandMore,
  ExpandLess,
  Edit,
  Delete,
  Search,
  Visibility,
  History,
  Update,
} from "@mui/icons-material";
import { Skeleton } from "@mui/material";
import ReactToPrint from "react-to-print";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { Button, message, Popconfirm, Modal } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPrint,
  faEye,
  faFileArrowDown,
  faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";
// import EditMeet from "./EditMeet";
// import Meeting_Details_Print from "./Meeting_Details_Print";
import axios from "axios";

const ViewMeet = () => {
  const [meetingData, setMeetingData] = useState(null);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSticky, setIsSticky] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPresentOpen, setIsPresentOpen] = useState(false);
  const [isAbsentOpen, setIsAbsentOpen] = useState(false);
  const [presents, setPresents] = useState([]);
  const [absents, setAbsents] = useState([]);
  const [attendees, setAttendees] = useState([]);
  const [highlights, setHighlights] = useState([]);

  const printRef = useRef();

  const loadingTimeout = setTimeout(() => {
    setIsLoading(false);
  }, 3000);

  const location = useLocation();

  const meetingId = location.pathname.split("/")[2];

  useEffect(() => {
    const fetchMeetingById = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3333/minofmeet/${meetingId}`
        );
        const meeting = res.data[0];
        setMeetingData(meeting);

        if (meeting.presents) {
          try {
            const parsedPresents = JSON.parse(meeting.presents);
            setPresents(parsedPresents);
          } catch (error) {
            console.error("Error parsing attendees JSON:", error);
            setPresents([]);
          }
        }

        if (meeting.absents) {
          try {
            const parsedAbsents = JSON.parse(meeting.absents);
            setAbsents(parsedAbsents);
          } catch (error) {
            console.error("Error parsing attendees JSON:", error);
            setAbsents([]);
          }
        }

        if (meeting.attendees) {
          try {
            const parsedAttendees = JSON.parse(meeting.attendees);
            setAttendees(parsedAttendees);
          } catch (error) {
            console.error("Error parsing attendees JSON:", error);
            setAttendees([]);
          }
        }

        if (meeting.highlights) {
          try {
            const parsedHighlights = JSON.parse(meeting.highlights);
            setHighlights(parsedHighlights);
          } catch (error) {
            console.error("Error parsing attendees JSON:", error);
            setHighlights([]);
          }
        }
      } catch (err) {
        console.error("Error fetching meeting data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMeetingById();
  }, [meetingId]);

  const meetingsPerPage = 2; // Adjust as needed
  const [currentPage, setCurrentPage] = useState(1);

  const startIndex = (currentPage - 1) * meetingsPerPage;
  const endIndex = Math.min(startIndex + meetingsPerPage);

  const cancel = () => {};

  const linkStyle = {
    textDecoration: "none",
    fontSize: "14px",
  };

  const handleEditClick = (meetingData) => {
    const meetingWithKey = { ...meetingData, key: meetingId };
    console.log("Meeting Id: ", meetingId);

    setSelectedMeeting(meetingWithKey);
    setIsEditModalOpen(true);
  };

  const handleMeetingEdit = (editedMeeting) => {
    setIsEditModalOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      // Check if the element is sticking to the top
      const divElement = document.querySelector(".headr");
      const boundingBox = divElement.getBoundingClientRect();
      setIsSticky(boundingBox.top <= 0);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const toggleViewAll = () => {
    setShowAllAttendees(!showAllAttendees);
  };

  const toggleModal = () => {
    setShowAllAttendees(!showAllAttendees);
  };

  const showAllAttendees = () => {
    setIsModalOpen(true);
  };

  const showAllPresents = () => {
    setIsPresentOpen(true);
  };

  const handleCancelPresents = () => {
    setIsPresentOpen(false);
  };

  const showAllAbsents = () => {
    setIsAbsentOpen(true);
  };

  const handleCancelAbsents = () => {
    setIsAbsentOpen(false);
  };

  const formatDate = (timestamp) => {
    const dateObj = new Date(timestamp);
    const year = dateObj.getFullYear();
    const month = dateObj.toLocaleString("default", { month: "long" });
    const day = dateObj.getDate();
    const hours = dateObj.getHours();
    const minutes = dateObj.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";

    return `${month} ${day}, ${year}`;
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        marginBottom: "20px",
      }}
    >
      <div
        className={`mt-2 px-4 py-4 justify-between items-center inset-0 sticky scroll-pt-4 z-10 headr ${
          isSticky
            ? "bg-white border-b-2 border-slate-300 dark:border-slate-300/10 dark:bg-slate-900"
            : ""
        }`}
      >
        <header className="font-bold ml-4 lg:text-2xl sm:text-xl">
          View Meeting
        </header>
      </div>
      <div className="mt-2 ml-8">
        <Breadcrumbs
          className="dark:text-slate-400"
          separator={<NavigateNextIcon fontSize="small" />}
          aria-label="breadcrumb"
        >
          <Link
            component={RouterLink}
            to="/Minutes-Of-the-Meeting"
            color="inherit"
            style={linkStyle}
          >
            Minutes of the Meeting
          </Link>
          <span className="dark:text-slate-400 font-semibold text-sm">
            View Meeting
          </span>
        </Breadcrumbs>
      </div>
      {isLoading ? (
        <div className="skeleton-loading">
          {/* Skeleton loading UI elements */}
          <Skeleton animation="wave" variant="text" width="100%" height={40} />
          <Skeleton animation="wave" variant="text" width="100%" height={40} />
        </div>
      ) : (
        <div>
          <div className=" bg-white shadow-md dark:bg-slate-800 rounded-lg mx-8 md:mx-14 mt-6 ">
            <div className="icon-container flex justify-between border-b-2 dark:border-b-slate-300/20 h-14">
              <div className="flex items-center ml-4"></div>

              <div className="flex items-center gap-9 mr-4">
                <div className="flex gap-4">
                  <Popconfirm
                    title="Do you want to Edit?"
                    onConfirm={() => handleEditClick(meetingData)}
                    onCancel={cancel}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Tooltip title="Edit Meeting">
                      <button
                        className={`dark:text-slate-500 flex items-center hover:text-blue-500 dark:hover:text-blue-500`}
                        aria-label="edit"
                        // onClick={() => handleEditClick(meetingData)}
                      >
                        <FontAwesomeIcon icon={faPenToSquare} />
                        {/* <Edit fontSize="small" /> */}
                      </button>
                    </Tooltip>
                  </Popconfirm>
                  <ReactToPrint
                    trigger={() => (
                      <Tooltip title="Print/Download">
                        <button
                          className={`dark:text-slate-500 flex items-center hover:text-blue-500 dark:hover:text-blue-500`}
                          aria-label="edit"
                        >
                          <FontAwesomeIcon icon={faPrint} />
                        </button>
                      </Tooltip>
                    )}
                    content={() => printRef.current}
                  />
                </div>
              </div>
            </div>

            <div className="mx-10 md:mx-14 mt-4 flex flex-col ">
              <div className="flex justify-between flex-col md:flex-row gap-1 sm:gap-0">
                <h1 className="font-semibold text-lg sm:text-3xl ">
                  {" "}
                  {meetingData.title}
                </h1>
              </div>

              <div className="flex justify-between flex-col sm:flex-row mt-2 sm:mt-4  ">
                <div className="">
                  <p className="font-medium text-xs sm:text-sm">
                    Venue: {meetingData.venue}
                  </p>
                </div>
                <div className=" justify-normal sm:justify-center flex text-xs sm:text-sm">
                  <span className="font-medium text-sm ml-6">
                    Date Conducted:{" "}
                    <span className="font-normal">
                      {formatDate(meetingData.date)}
                    </span>
                  </span>
                </div>
              </div>

              {/* Present */}
              <div className="my-6 ">
                <div className="flex justify-between">
                  <span className="font-medium text-xs sm:text-base">
                    A. Present during the meeting
                  </span>

                  <button className="ml-2" onClick={showAllPresents}>
                    <span className="text-sm hover:text-blue-600 text-blue-500">
                      View All
                    </span>
                  </button>
                </div>
                <TableContainer
                  component={Paper}
                  className="dark:bg-slate-800 "
                  style={{ boxShadow: "none", borderRadius: "0px" }}
                >
                  <Table aria-label="meeting table">
                    <TableHead>
                      <TableRow>
                        <TableCell className="dark:text-slate-300 dark:border-b-slate-300/10 font-bold">
                          Name
                        </TableCell>
                        <TableCell className="dark:text-slate-300 dark:border-b-slate-300/10 font-bold">
                          Office
                        </TableCell>
                        <TableCell className="dark:text-slate-300 dark:border-b-slate-300/10 font-bold">
                          Position
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Array.isArray(presents) ? (
                        presents.map((presentArray, index) => (
                          <TableRow key={index}>
                            <TableCell className="dark:text-slate-400 dark:border-b-slate-300/10 ">
                              {presentArray.present}
                            </TableCell>
                            <TableCell className="dark:text-slate-400 dark:border-b-slate-300/10">
                              {presentArray.office}
                            </TableCell>
                            <TableCell className="dark:text-slate-400 dark:border-b-slate-300/10">
                              {presentArray.position}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={3}
                            className="dark:text-slate-400 dark:border-b-slate-300/10"
                          >
                            No present
                          </TableCell>
                        </TableRow>
                      )}
                      {presents &&
                        presents.length > 3 &&
                        presents.length !=
                        (
                          <TableRow>
                            <TableCell
                              colSpan={3}
                              className="dark:text-slate-400 dark:border-b-slate-300/10"
                            >
                              , and more
                            </TableCell>
                          </TableRow>
                        )}
                    </TableBody>
                  </Table>
                </TableContainer>

                <Modal
                  title={
                    <div
                      style={{
                        textAlign: "center",
                        paddingBottom: "6px",
                        fontWeight: "bold",
                      }}
                    >
                      List of All Presents
                    </div>
                  }
                  open={isPresentOpen}
                  onOk={handleOk}
                  onCancel={handleCancelPresents}
                  footer={[
                    <div
                      key="footer"
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                      }}
                    >
                      <div>
                        <Button key="cancel" onClick={handleCancelPresents}>
                          Close
                        </Button>
                      </div>
                    </div>,
                  ]}
                >
                  <TableContainer
                    component={Paper}
                    style={{ boxShadow: "none", borderRadius: "0px" }}
                  >
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Name</TableCell>
                          <TableCell>Office</TableCell>
                          <TableCell>Position</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {Array.isArray(presents) ? (
                          presents.map((presentArray, index) => (
                            <TableRow key={index}>
                              <TableCell>{presentArray.present}</TableCell>
                              <TableCell>{presentArray.office}</TableCell>
                              <TableCell>{presentArray.position}</TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={3} align="center">
                              No present
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Modal>
              </div>

              {/* Absent */}
              <div className="my-6 ">
                <div className="flex justify-between">
                  <span className="font-medium text-xs sm:text-base">
                    B. Absent during the meeting
                  </span>

                  <button className="ml-2" onClick={showAllAbsents}>
                    <span className="text-sm hover:text-blue-600 text-blue-500">
                      View All
                    </span>
                  </button>
                </div>
                <TableContainer
                  component={Paper}
                  style={{ boxShadow: "none", borderRadius: "0px" }}
                  className="dark:bg-slate-800 "
                >
                  <Table aria-label="absents table">
                    <TableHead>
                      <TableRow>
                        <TableCell className="dark:text-slate-300 dark:border-b-slate-300/10 font-bold">
                          Name
                        </TableCell>
                        <TableCell className="dark:text-slate-300 dark:border-b-slate-300/10 font-bold">
                          Office
                        </TableCell>
                        <TableCell className="dark:text-slate-300 dark:border-b-slate-300/10 font-bold">
                          Position
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Array.isArray(absents) ? (
                        absents.map((absentArray, index) => (
                          <TableRow key={index}>
                            <TableCell className="dark:text-slate-400 dark:border-b-slate-300/10 ">
                              {absentArray.absent}
                            </TableCell>
                            <TableCell className="dark:text-slate-400 dark:border-b-slate-300/10 ">
                              {absentArray.office}
                            </TableCell>
                            <TableCell className="dark:text-slate-400 dark:border-b-slate-300/10 ">
                              {absentArray.position}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={3}
                            className="dark:text-slate-400 dark:border-b-slate-300/10 "
                          >
                            No absent
                          </TableCell>
                        </TableRow>
                      )}
                      {absents &&
                        absents.length > 3 &&
                        absents.length !=
                        (
                          <TableRow>
                            <TableCell
                              colSpan={3}
                              className="dark:text-slate-400 dark:border-b-slate-300/10"
                            >
                              , and more
                            </TableCell>
                          </TableRow>
                        )}
                    </TableBody>
                  </Table>
                </TableContainer>

                <Modal
                  title={
                    <div
                      style={{
                        textAlign: "center",
                        paddingBottom: "6px",
                        fontWeight: "bold",
                      }}
                    >
                      List of All Absents
                    </div>
                  }
                  open={isAbsentOpen}
                  onOk={handleOk}
                  onCancel={handleCancelAbsents}
                  footer={[
                    <div
                      key="footer"
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                      }}
                    >
                      <div>
                        <Button key="cancel" onClick={handleCancelAbsents}>
                          Close
                        </Button>
                      </div>
                    </div>,
                  ]}
                >
                  <TableContainer
                    component={Paper}
                    style={{ boxShadow: "none", borderRadius: "0px" }}
                  >
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Name</TableCell>
                          <TableCell>Office</TableCell>
                          <TableCell>Position</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {Array.isArray(absents) ? (
                          absents.map((absentArray, index) => (
                            <TableRow key={index}>
                              <TableCell>{absentArray.absent}</TableCell>
                              <TableCell>{absentArray.office}</TableCell>
                              <TableCell>{absentArray.position}</TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={3} align="center">
                              No absent
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Modal>
              </div>

              {/* Other Attendees */}
              <div className="my-6 ">
                <div className="flex justify-between">
                  <span className="font-medium text-xs sm:text-base">
                    C. Other attendees during the meeting
                  </span>

                  <button className="ml-2" onClick={showAllAttendees}>
                    <span className="text-sm hover:text-blue-600 text-blue-500">
                      View All
                    </span>
                  </button>
                </div>
                <TableContainer
                  component={Paper}
                  className="dark:bg-slate-800 "
                  style={{ boxShadow: "none", borderRadius: "0px" }}
                >
                  <Table aria-label="attendees table">
                    <TableHead>
                      <TableRow>
                        <TableCell className="dark:text-slate-300 dark:border-b-slate-300/10 font-bold">
                          Name
                        </TableCell>
                        <TableCell className="dark:text-slate-300 dark:border-b-slate-300/10 font-bold">
                          Office
                        </TableCell>
                        <TableCell className="dark:text-slate-300 dark:border-b-slate-300/10 font-bold">
                          Position
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Array.isArray(attendees) ? (
                        attendees.map((attendeeArray, index) => (
                          <TableRow key={index}>
                            <TableCell className="dark:text-slate-400 dark:border-b-slate-300/10 ">
                              {attendeeArray.attendee}
                            </TableCell>
                            <TableCell className="dark:text-slate-400 dark:border-b-slate-300/10 ">
                              {attendeeArray.office}
                            </TableCell>
                            <TableCell className="dark:text-slate-400 dark:border-b-slate-300/10 ">
                              {attendeeArray.position}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={3}
                            className="dark:text-slate-400 dark:border-b-slate-300/10 "
                          >
                            No other attendees
                          </TableCell>
                        </TableRow>
                      )}
                      {attendees &&
                        attendees.length > 3 &&
                        attendees.length !=
                        (
                          <TableRow>
                            <TableCell
                              colSpan={3}
                              className="dark:text-slate-400 dark:border-b-slate-300/10"
                            >
                              , and more
                            </TableCell>
                          </TableRow>
                        )}
                    </TableBody>
                  </Table>
                </TableContainer>
                <Modal
                  title={
                    <div
                      style={{
                        textAlign: "center",
                        paddingBottom: "6px",
                        fontWeight: "bold",
                      }}
                    >
                      List of All Other Attendees
                    </div>
                  }
                  open={isModalOpen}
                  onOk={handleOk}
                  onCancel={handleCancel}
                  footer={[
                    <div
                      key="footer"
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                      }}
                    >
                      <div>
                        <Button key="cancel" onClick={handleCancel}>
                          Close
                        </Button>
                      </div>
                    </div>,
                  ]}
                >
                  <TableContainer
                    component={Paper}
                    style={{ boxShadow: "none", borderRadius: "0px" }}
                  >
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Name</TableCell>
                          <TableCell>Office</TableCell>
                          <TableCell>Position</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {Array.isArray(attendees) ? (
                          attendees.map((attendeeArray, index) => (
                            <TableRow key={index}>
                              <TableCell>{attendeeArray.attendee}</TableCell>
                              <TableCell>{attendeeArray.office}</TableCell>
                              <TableCell>{attendeeArray.position}</TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={3} align="center">
                              No other attendees
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Modal>
              </div>

              <div className=" text-xs sm:text-sm flex text-center gap-2">
                <div className=" text-xs sm:text-base">
                  <p className="font-medium">
                    D. Chaired By:
                    <span className="ml-1 font-normal text-justify whitespace-pre-line">
                      {meetingData.chairedBy.split("\n").map((line, index) => (
                        <React.Fragment key={index}>
                          {line.startsWith("*") ? (
                            <span className="bold-text">{line.slice(1)}</span>
                          ) : (
                            <span>{line}</span>
                          )}
                        </React.Fragment>
                      ))}
                    </span>
                  </p>
                </div>
                <div className="text-xs sm:text-base">
                  <p className="font-medium ">
                    Time Started:{" "}
                    <span className="font-normal">{meetingData.startTime}</span>
                  </p>
                </div>
              </div>

              {/* Highlights */}
              <div className="my-6 ">
                <span className="font-medium text-xs sm:text-base">
                  E. Highlights of the Meeting
                </span>

                <TableContainer
                  component={Paper}
                  style={{ boxShadow: "none", borderRadius: "0px" }}
                  className="dark:bg-slate-800 "
                >
                  <Table aria-label="highlights table">
                    <TableHead>
                      <TableRow>
                        <TableCell className="dark:text-slate-300 dark:border-b-slate-300/10 font-bold">
                          AGENDA / HIGHLIGHTS
                        </TableCell>
                        <TableCell className="dark:text-slate-300 dark:border-b-slate-300/10  font-bold">
                          WHO / WHEN
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Array.isArray(highlights) ? (
                        highlights.map((highlightArray, index) => (
                          <TableRow key={index}>
                            <TableCell className="dark:text-slate-400 dark:border-b-slate-300/10 ">
                              <p className="whitespace-pre-line">
                                {highlightArray.highlight}
                              </p>
                            </TableCell>
                            <TableCell className="dark:text-slate-400 dark:border-b-slate-300/10 ">
                              {highlightArray.who}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={2}
                            className="dark:text-slate-400 dark:border-b-slate-300/10 "
                          >
                            No highlights
                          </TableCell>
                        </TableRow>
                      )}
                      {highlights &&
                        highlights.length > 3 &&
                        highlights.length !=
                        (
                          <TableRow>
                            <TableCell colSpan={2}>, and more</TableCell>
                          </TableRow>
                        )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
              <div className="my-6">
                <p className="mt-1 ml-1 font-normal">
                  F. Time Adjourned:{" "}
                  <span className="font-medium">{meetingData.endTime}</span>
                </p>
              </div>
            </div>
            <div className="mt-6 "></div>
          </div>
          {/*  */}
          <div className="hidden print:block" ref={printRef}>
            {/* Print Template component for printing */}
            {/* <Meeting_Details_Print meetingData={meetingData} /> */}
          </div>
        </div>
      )}
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
  );
};

export default ViewMeet;
