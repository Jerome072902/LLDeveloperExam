import React, { useState, useEffect } from "react";
import {
  Modal,
  Input,
  TimePicker,
  DatePicker,
  Form,
  message,
  Upload,
  Space,
  Button,
} from "antd";
import moment from "moment";
import { UploadOutlined, MinusCircleOutlined } from "@ant-design/icons";

import axios from "axios";

import { useLocation } from "react-router-dom";

import "./EditMeet.css";

function EditMeet({ initialData, isOpen, onSave, onClose }) {
  const [formData, setFormData] = useState({
    ...initialData,
    attendees: [],
    presents: [],
    absents: [],
    highlights: [],
  });
  const [fileList, setFileList] = useState([]);
  const [uploadedFileNames, setUploadedFileNames] = useState([]);
  useEffect(() => {
    console.log("Initial Data:", initialData);
    setFormData(initialData);
  }, [initialData]);

  const calculateDuration = (startTime, endTime) => {
    if (startTime && endTime) {
      const startMoment = moment(startTime, "h:mm A");
      const endMoment = moment(endTime, "h:mm A");

      if (endMoment.isBefore(startMoment)) {
        endMoment.add(1, "day");
      }

      const duration = moment.duration(endMoment.diff(startMoment));
      const hours = duration.hours();
      const minutes = duration.minutes();
      return `${hours} hour/s ${minutes} minute/s`;
    }
    return "";
  };

  const handleDateChange = (date, dateString) => {
    setFormData({ ...formData, date: dateString });
  };

  const location = useLocation();

  const meetingId = location.pathname.split("/")[2];

  console.log(formData);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (
        formData.title !== initialData.title ||
        formData.startTime !== initialData.startTime ||
        formData.endTime !== initialData.endTime ||
        formData.date !== initialData.date ||
        formData.venue !== initialData.venue ||
        JSON.stringify(formData.highlights) !==
          JSON.stringify(initialData.highlights) ||
        JSON.stringify(formData.presents) !==
          JSON.stringify(initialData.presents) ||
        JSON.stringify(formData.absents) !==
          JSON.stringify(initialData.absents) ||
        JSON.stringify(formData.attendees) !==
          JSON.stringify(initialData.attendees) ||
        formData.chairedBy !== initialData.chairedBy
      ) {
        const duration = calculateDuration(
          formData.startTime,
          formData.endTime
        );
        setFormData({ ...formData, duration });
        console.log("Duration: ", duration);
        await axios.put("http://localhost:3333/minofmeet/" + meetingId, {
          ...formData,
          duration: duration,
        });
        console.log("Fields Data: ", formData);
        onSave();
        onClose();
        message.success(`Meeting updated successfully.`);
        window.location.reload();
      } else {
        onClose();
      }
    } catch (err) {
      console.log(err);
      console.error("Error updating meeting: ", err);
    }
  };

  // Add this function to handle file upload
  const uploadFiles = async () => {
    const downloadURLs = [];

    for (const file of fileList) {
      try {
        // Check if the file with the same name already exists in Firebase Storage
        const storageRef = ref(storage, `minOfMeetFiles/${file.name}`);
        const existingDownloadURL = await getDownloadURL(storageRef).catch(
          (error) => {
            // Handle the error, and consider it as the file not existing
            return null;
          }
        );

        if (!existingDownloadURL) {
          // If the file doesn't exist, upload it
          await uploadBytes(storageRef, file);
        }

        // Get the download URL (either existing or newly uploaded)
        const downloadURL = await getDownloadURL(storageRef);
        downloadURLs.push(downloadURL);
      } catch (error) {
        console.error("Error handling files:", error);
        message.error("File handling failed. Please try again.");
      }
    }

    return downloadURLs;
  };

  const handleAttach = (info) => {
    if (info.file.status === "done") {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  const handleBeforeUpload = (file) => {
    // Check if the file with the same name already exists in fileList
    const isFileAlreadyUploaded = fileList.some(
      (uploadedFile) => uploadedFile.name === file.name
    );

    if (!isFileAlreadyUploaded) {
      // Append the new file to fileList only if it doesn't exist
      setFileList([...fileList, file]);
    }

    return false;
  };

  const handleRemove = (file) => {
    const updatedFileList = fileList.filter((f) => f !== file);
    setFileList(updatedFileList);
    const updatedAttachments = formData.attachments.filter(
      (url) => url !== file.url
    );
    setFormData({ ...formData, attachments: updatedAttachments });
  };

  // Highlight
  const handleRemoveHighlight = (index) => {
    const updatedHighlight = [...formData.highlights];
    updatedHighlight.splice(index, 1);
    setFormData({ ...formData, highlights: updatedHighlight });
  };

  const handleAddHighlight = () => {
    setFormData({
      ...formData,
      highlights: [...(formData.highlights || []), { highlight: "" }],
    });
  };

  const handleHighlightChange = (index, key, value) => {
    const updatedHighlight = [...formData.highlights];
    updatedHighlight[index] = {
      ...updatedHighlight[index],
      [key]: value,
    };
    setFormData({ ...formData, highlights: updatedHighlight });
  };

  // Present
  const handleRemovePresent = (index) => {
    const updatedPresent = [...formData.presents];
    updatedPresent.splice(index, 1);
    setFormData({ ...formData, presents: updatedPresent });
  };

  const handleAddPresent = () => {
    setFormData({
      ...formData,
      presents: [...(formData.presents || []), { present: "" }],
    });
  };

  const handlePresentChange = (index, key, value) => {
    const updatedPresent = [...formData.presents];
    updatedPresent[index] = {
      ...updatedPresent[index],
      [key]: value,
    };
    setFormData({ ...formData, presents: updatedPresent });
  };

  // Absent
  const handleRemoveAbsent = (index) => {
    const updatedAbsent = [...formData.absents];
    updatedAbsent.splice(index, 1);
    setFormData({ ...formData, absents: updatedAbsent });
  };

  const handleAddAbsent = () => {
    setFormData({
      ...formData,
      absents: [...(formData.absents || []), { absent: "" }],
    });
  };

  const handleAbsentChange = (index, key, value) => {
    const updatedAbsent = [...formData.absents];
    updatedAbsent[index] = {
      ...updatedAbsent[index],
      [key]: value,
    };
    setFormData({ ...formData, absents: updatedAbsent });
  };

  // Other Attendee
  const handleRemoveAttendee = (index) => {
    const updatedAttendee = [...formData.attendees];
    updatedAttendee.splice(index, 1);
    setFormData({ ...formData, attendees: updatedAttendee });
  };

  const handleAddAttendee = () => {
    setFormData({
      ...formData,
      attendees: [...(formData.attendees || []), { attendee: "" }],
    });
  };

  const handleAttendeeChange = (index, key, value) => {
    const updatedAttendee = [...formData.attendees];
    updatedAttendee[index] = {
      ...updatedAttendee[index],
      [key]: value,
    };
    setFormData({ ...formData, attendees: updatedAttendee });
  };

  useEffect(() => {
    if (initialData) {
      const parsedData = {
        ...initialData,
        attendees: parseJSONField(initialData.attendees),
        presents: parseJSONField(initialData.presents),
        absents: parseJSONField(initialData.absents),
        highlights: parseJSONField(initialData.highlights),
      };
      setFormData(parsedData);
    }
  }, [initialData]);

  const parseJSONField = (field) => {
    try {
      return field ? JSON.parse(field) : [];
    } catch (error) {
      console.error(`Error parsing JSON field:`, error);
      return [];
    }
  };

  return (
    <Modal
      title={
        <div
          style={{
            textAlign: "center",
            paddingBottom: "6px",
            fontWeight: "bold",
          }}
        >
          Edit Meeting
        </div>
      }
      open={isOpen}
      onOk={handleSave}
      onCancel={onClose}
      width={700}
    >
      <Form className="overflow-y-auto max-h-[500px] custom-scrollbar">
        <div className="mr-2">
          <Form.Item label="Subject">
            <Input
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
          </Form.Item>

          <Form.Item label="Venue">
            <Input
              value={formData.venue}
              onChange={(e) =>
                setFormData({ ...formData, venue: e.target.value })
              }
            />
          </Form.Item>

          <Form.Item label="Date Conducted" name="date">
            <DatePicker
              style={{ width: "100%" }}
              value={moment(formData.date)}
              placeholder={formData.date}
              onChange={handleDateChange}
              className="custom-datepicker"
            />
          </Form.Item>
          {/* Presents */}
          <div>
            <p className="font-bold mb-2"> A. Present during the meeting</p>
            <Form.Item
            // name="attendees"
            // label="Present"
            >
              {formData.presents.map((presentArray, index) => (
                <div key={index} className="flex">
                  <Space
                    className="flex mb-4 sm:flex-row flex-col h-auto sm:h-4"
                    align="baseline"
                  >
                    <div>
                      <Input
                        value={presentArray.present}
                        onChange={(e) =>
                          handlePresentChange(index, "present", e.target.value)
                        }
                        placeholder="Present"
                      />
                    </div>
                    <div>
                      <Input
                        value={presentArray.office}
                        onChange={(e) =>
                          handlePresentChange(index, "office", e.target.value)
                        }
                        placeholder="Office"
                      />
                    </div>
                    <div>
                      <Input
                        value={presentArray.position}
                        onChange={(e) =>
                          handlePresentChange(index, "position", e.target.value)
                        }
                        placeholder="Position"
                      />
                    </div>
                  </Space>
                  <Button
                    className="ml-2 self-center"
                    onClick={() => handleRemovePresent(index)}
                    icon={<MinusCircleOutlined />}
                    danger
                    style={{ borderColor: "transparent" }}
                  ></Button>
                </div>
              ))}
              <div className="mt-2">
                <Button type="dashed" onClick={handleAddPresent}>
                  Add Present
                </Button>
              </div>
            </Form.Item>
          </div>
          {/* Absents */}
          <div>
            <p className="font-bold mb-2">
              B. Absent during the meeting (where appropiate, indicate reason
              for absence)
            </p>
            <Form.Item
            // name="attendees"
            // label="Absent"
            >
              {formData.absents.map((absentArray, index) => (
                <div key={index} className="flex">
                  <Space
                    className="flex mb-4 sm:flex-row flex-col h-auto sm:h-4"
                    align="baseline"
                  >
                    <div>
                      <Input
                        value={absentArray.absent}
                        onChange={(e) =>
                          handleAbsentChange(index, "absent", e.target.value)
                        }
                        placeholder="Attendee"
                      />
                    </div>
                    <div>
                      <Input
                        value={absentArray.office}
                        onChange={(e) =>
                          handleAbsentChange(index, "office", e.target.value)
                        }
                        placeholder="Office"
                      />
                    </div>
                    <div>
                      <Input
                        value={absentArray.position}
                        onChange={(e) =>
                          handleAbsentChange(index, "position", e.target.value)
                        }
                        placeholder="Position"
                      />
                    </div>
                  </Space>
                  <Button
                    className="self-center ml-2"
                    onClick={() => handleRemoveAbsent(index)}
                    icon={<MinusCircleOutlined />}
                    danger
                    style={{ borderColor: "transparent" }}
                  ></Button>
                </div>
              ))}
              <div className="mt-2">
                <Button type="dashed" onClick={handleAddAbsent}>
                  Add Absent
                </Button>
              </div>
            </Form.Item>
          </div>
          {/* Attendees */}
          <div>
            <p className="font-bold mb-2">
              C. Other attendees during the meeting
            </p>
            <Form.Item
            // name="attendees"
            // label="Other Attendee/s"
            >
              {formData.attendees.map((attendeeArray, index) => (
                <div key={index} className="flex">
                  <Space
                    className="flex mb-4 sm:flex-row flex-col h-auto sm:h-4"
                    align="baseline"
                  >
                    <div>
                      <Input
                        value={attendeeArray.attendee}
                        onChange={(e) =>
                          handleAttendeeChange(
                            index,
                            "attendee",
                            e.target.value
                          )
                        }
                        placeholder="Attendee"
                      />
                    </div>
                    <div>
                      <Input
                        value={attendeeArray.office}
                        onChange={(e) =>
                          handleAttendeeChange(index, "office", e.target.value)
                        }
                        placeholder="Office"
                      />
                    </div>
                    <div>
                      <Input
                        value={attendeeArray.position}
                        onChange={(e) =>
                          handleAttendeeChange(
                            index,
                            "position",
                            e.target.value
                          )
                        }
                        placeholder="Position"
                      />
                    </div>
                  </Space>
                  <Button
                    onClick={() => handleRemoveAttendee(index)}
                    icon={<MinusCircleOutlined />}
                    danger
                    style={{ borderColor: "transparent" }}
                  ></Button>
                </div>
              ))}
              <div className="mt-2">
                <Button type="dashed" onClick={handleAddAttendee}>
                  Add Attendee
                </Button>
              </div>
            </Form.Item>
          </div>

          <div className="flex gap-2 sm:flex-row flex-col">
            <div className="flex sm:flex-row flex-col h-14 sm:h-auto">
              <p className="font-bold mt-1 mr-1 mb-2 sm:mb-0">D. Chaired By:</p>

              <Form.Item>
                <Input
                  value={formData.chairedBy}
                  onChange={(e) =>
                    setFormData({ ...formData, chairedBy: e.target.value })
                  }
                />
              </Form.Item>
            </div>
            <div className="flex sm:flex-row flex-col h-[80px] sm:h-auto">
              <p className="font-bold mt-1 mr-1 mb-2 sm:mb-0">Time Started:</p>
              <Form.Item
                name="startTime"
                className="side-by-side"
                style={{ width: "160px" }}
              >
                <TimePicker
                  format="h:mm A"
                  value={[moment(formData.startTime, "h:mm A")]}
                  placeholder={[formData.startTime]}
                  className="custom-timepicker"
                  onChange={(time, timeString) =>
                    setFormData({ ...formData, startTime: timeString })
                  }
                />
              </Form.Item>
            </div>
          </div>
          {/* Highlights */}
          <div>
            <p className="font-bold mb-2"> E. Highlights of the Meeting</p>
            <Form.Item
              // name="attendees"
              // label="Highlights"
              className="ml-4"
            >
              {formData.highlights.map((highlightArray, index) => (
                <div key={index} className="flex">
                  <Space
                    className="flex mb-4 gap-0 sm:gap-4 sm:flex-row flex-col"
                    align="baseline"
                  >
                    <div>
                      <p className="font-medium text-center mb-1">
                        Agenda / Highlights
                      </p>
                      <Input.TextArea
                        value={highlightArray.highlight}
                        onChange={(e) =>
                          handleHighlightChange(
                            index,
                            "highlight",
                            e.target.value
                          )
                        }
                        placeholder="Highlight"
                        rows={4}
                        allowClear
                      />
                    </div>
                    <div>
                      <p className="font-medium text-center mb-1">Who / When</p>
                      <Input
                        value={highlightArray.who}
                        onChange={(e) =>
                          handleHighlightChange(index, "who", e.target.value)
                        }
                        placeholder="Who"
                      />
                    </div>
                  </Space>
                  <Button
                    className="self-center"
                    onClick={() => handleRemoveHighlight(index)}
                    icon={<MinusCircleOutlined />}
                    danger
                    style={{ borderColor: "transparent" }}
                  ></Button>
                </div>
              ))}
              <div className="mt-1">
                <Button type="dashed" onClick={handleAddHighlight}>
                  Add Highlight
                </Button>
              </div>
            </Form.Item>
          </div>
          <div className="flex sm:flex-row flex-col">
            <p className="font-bold mr-1 mt-1 sm:mb-0 mb-2">
              F. Time Adjourned:
            </p>
            <Form.Item
              name="endTime"
              className="side-by-side"
              style={{ width: "160px" }}
            >
              <TimePicker
                format="h:mm A"
                value={[moment(formData.endTime, "h:mm A")]}
                placeholder={[formData.endTime]}
                className="custom-timepicker"
                onChange={(time, timeString) =>
                  setFormData({ ...formData, endTime: timeString })
                }
              />
            </Form.Item>
          </div>
        </div>
      </Form>
    </Modal>
  );
}

export default EditMeet;
