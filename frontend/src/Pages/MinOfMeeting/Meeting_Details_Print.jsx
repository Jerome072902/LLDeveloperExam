import React, { useState, useEffect, forwardRef } from "react";
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
import "./print.css";

const Meeting_Details_Print = ({ meetingData }) => {
  const [formData, setFormData] = useState({
    ...meetingData,
    attendees: [],
    presents: [],
    absents: [],
    highlights: [],
  });

  useEffect(() => {
    if (meetingData) {
      const parsedData = {
        ...meetingData,
        attendees: parseJSONField(meetingData.attendees),
        presents: parseJSONField(meetingData.presents),
        absents: parseJSONField(meetingData.absents),
        highlights: parseJSONField(meetingData.highlights),
      };
      setFormData(parsedData);
    }
  }, [meetingData]);

  const parseJSONField = (field) => {
    try {
      return field ? JSON.parse(field) : [];
    } catch (error) {
      console.error(`Error parsing JSON field:`, error);
      return [];
    }
  };

  return (
    <div className="p-6 print-holder top-3">
      <div id="header">
        <div className="flex text-center justify-center font-bold gap-2 "></div>
      </div>
      <div className="mt-14 top-28">
        <div>
          <div className="text-center">
            <h1 className="font-bold text-xl">Minutes of Meeting</h1>
          </div>
          <div className="flex justify-between mt-6 info-1">
            <h1>
              <span className="pr-1 font-bold">Subject:</span>
              {formData.title}
            </h1>
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-1 ">
        <h5>
          <span className="pr-1 font-bold">Venue:</span>
          {formData.venue}
        </h5>
        <h5>
          <span className="pr-1 font-bold">Date Conducted:</span>
          {formData.date}
        </h5>
      </div>
      <div>
        <div className="mb-2">
          <span className="font-bold">A. Present during the meeting</span>
          <TableContainer
            component={Paper}
            style={{
              boxShadow: "none",
              borderRadius: "0px",
              backgroundColor: "transparent",
            }}
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
                {Array.isArray(formData.presents) ? (
                  formData.presents.map((presentArray, index) => (
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
        </div>
        <div className="mb-2">
          <span className="font-bold">
            B. Absent during the meeting (where appropriate, indicate reason for
            absence)
          </span>
          <TableContainer
            component={Paper}
            style={{
              boxShadow: "none",
              borderRadius: "0px",
              backgroundColor: "transparent",
            }}
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
                {Array.isArray(formData.absents) ? (
                  formData.absents.map((absentArray, index) => (
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
        </div>
        <div className="mb-2">
          <span className="font-bold">
            C. Other attendees during the meeting
          </span>
          <TableContainer
            component={Paper}
            className="dark:bg-slate-800 "
            style={{
              boxShadow: "none",
              borderRadius: "0px",
              backgroundColor: "transparent",
            }}
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
                {Array.isArray(formData.attendees) ? (
                  formData.attendees.map((attendeeArray, index) => (
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
                      className="dark:text-slate-400 dark:border-b-slate-300/10"
                      align="center"
                    >
                      No other attendees
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
      <div className="flex gap-10 mb-4 mt-2">
        <h5>
          <span className="font-bold"> D. Chaired by: </span>
          <span>
            {formData.chairedBy.split("\n").map((line, index) => (
              <React.Fragment key={index}>
                {line.startsWith("*") ? (
                  <span className="bold-text">{line.slice(1)}</span>
                ) : (
                  <span>{line}</span>
                )}
              </React.Fragment>
            ))}
          </span>
        </h5>
        <h5>
          <span className="pr-1 font-bold">Time Started:</span>
          {formData.startTime}
        </h5>
      </div>
      <div className="mb-2 ">
        <span className="font-bold"> E. Highlights of the Meeting</span>
        <TableContainer
          component={Paper}
          style={{
            boxShadow: "none",
            borderRadius: "0px",
            backgroundColor: "transparent",
          }}
        >
          <Table aria-label="highlights table">
            <TableHead>
              <TableRow>
                <TableCell
                  className="dark:text-slate-300 font-bold border"
                  style={{
                    fontWeight: "700",
                  }}
                >
                  AGENDA / HIGHLIGHTS
                </TableCell>
                <TableCell
                  className="dark:text-slate-300 font-bold border"
                  style={{
                    fontWeight: "700",
                  }}
                >
                  WHO / WHEN
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.isArray(formData.highlights) ? (
                formData.highlights.map((highlightArray, index) => (
                  <TableRow key={index}>
                    <TableCell className="dark:text-slate-400 dark:border-b-slate-300/10 border">
                      <p className="whitespace-pre-line">
                        {highlightArray.highlight}
                      </p>
                    </TableCell>
                    <TableCell className="dark:text-slate-400 dark:border-b-slate-300/10 border">
                      {highlightArray.who}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={2}
                    className="dark:text-slate-400 dark:border-b-slate-300/10 "
                    align="center"
                  >
                    No highlights
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <div>
        <h5>
          <span className="font-bold"> F. Time Adjourned:</span>
          <span className="pl-1">{formData.endTime}</span>
        </h5>
      </div>
    </div>
  );
};

export default Meeting_Details_Print;
