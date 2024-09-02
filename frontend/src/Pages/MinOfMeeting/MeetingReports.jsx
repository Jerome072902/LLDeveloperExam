// MeetingReports.jsx

import React, { useState, useEffect, forwardRef } from "react";
// import logo from "../../Components/Pictures/logo.png";
// import bulsu from "../../Components/Pictures/bulsu.png";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Collapse,
  TablePagination,
  TableFooter,
  Grid,
  Skeleton,
  Container,
} from "@mui/material";

import "./MReport.css";
const MeetingReports = forwardRef(({ data }, ref) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  useEffect(() => {
    if (data.length > 0) {
      const sortedData = data
        .slice()
        .sort((a, b) => new Date(a.date) - new Date(b.date));
      setFromDate(sortedData[0].date);
      setToDate(sortedData[sortedData.length - 1].date);
    }
  }, [data]);

  return (
    <div className="p-2">
      <div className="flex text-center justify-center font-bold gap-2"></div>
      <div className="">
        <div className="flex justify-center">
          <div>
            <h4 className="font-bold text-lg">Minutes of Meeting Summary</h4>
          </div>
        </div>
      </div>

      <main className="">
        <div>
          <div className="flex gap-2 mt-6 mb-2">
            <div>
              {" "}
              <span className="font-bold">From Date:</span> {fromDate}
            </div>
            {data.length > 1 && (
              <div>
                <span className="font-bold">To Date: </span>
                {toDate}
              </div>
            )}
          </div>
        </div>

        <TableContainer
          component={Paper}
          className="mt-4"
          style={{
            boxShadow: "none",
            borderRadius: "0px",
            backgroundColor: "transparent",
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell
                  className="text-center align-middle dark:text-slate-300 font-bold border"
                  style={{
                    fontWeight: "700",
                    textAlign: "center",
                  }}
                >
                  Subject
                </TableCell>
                <TableCell
                  className="text-center align-middle dark:text-slate-300 font-bold border"
                  style={{
                    fontWeight: "700",
                    textAlign: "center",
                  }}
                >
                  Venue
                </TableCell>
                <TableCell
                  className="dark:text-slate-300 font-bold border whitespace-nowrap"
                  style={{
                    fontWeight: "700",
                  }}
                >
                  Date Conducted
                </TableCell>
                <TableCell
                  className="text-center align-middle dark:text-slate-300 font-bold border whitespace-nowrap"
                  style={{
                    fontWeight: "700",
                    textAlign: "center",
                  }}
                >
                  Chaired by
                </TableCell>
                <TableCell
                  className="text-center align-middle dark:text-slate-300 font-bold border whitespace-nowrap"
                  style={{
                    fontWeight: "700",
                    textAlign: "center",
                  }}
                >
                  Time Started
                </TableCell>
                <TableCell
                  className="dark:text-slate-300 font-bold border whitespace-nowrap"
                  style={{
                    fontWeight: "700",
                  }}
                >
                  Time Adjourned
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((record) => (
                <TableRow key={record.key}>
                  <TableCell className="dark:text-slate-400 dark:border-b-slate-300/10 border">
                    {record.title}
                  </TableCell>
                  <TableCell className="dark:text-slate-400 dark:border-b-slate-300/10 border">
                    {record.venue}
                  </TableCell>
                  <TableCell className="dark:text-slate-400 dark:border-b-slate-300/10 border">
                    {record.date}
                  </TableCell>
                  <TableCell className="dark:text-slate-400 dark:border-b-slate-300/10 border">
                    {record.chairedBy.split("\n").map((line, index) => (
                      <React.Fragment key={index}>
                        {line.startsWith("*") ? (
                          <span className="bold-text">{line.slice(1)}</span>
                        ) : (
                          <span>{line}</span>
                        )}
                      </React.Fragment>
                    ))}
                  </TableCell>
                  <TableCell className="dark:text-slate-400 dark:border-b-slate-300/10 border">
                    {record.startTime}
                  </TableCell>
                  <TableCell className="dark:text-slate-400 dark:border-b-slate-300/10 border">
                    {record.endTime}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </main>
    </div>
  );
});

export default MeetingReports;
