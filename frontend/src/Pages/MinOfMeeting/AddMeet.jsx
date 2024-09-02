import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { UploadOutlined } from "@ant-design/icons";
import {
  Button,
  Modal,
  Input,
  TimePicker,
  DatePicker,
  Form,
  Affix,
  FloatButton,
  message,
  Upload,
  Space,
} from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";

import moment from "moment";

import "./AddMeet.css";

import axios from "axios";

function AddMeet() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fileList, setFileList] = useState([]);

  const [meeting, setMeeting] = useState({
    title: "",
    venue: "",
    date: "",
    startTime: "",
    endTime: "",
    detail: "",
    attendees: [],
  });

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

  const handleClick = async (e) => {
    e.preventDefault();
    if (
      !meeting.title ||
      !meeting.venue ||
      !meeting.date ||
      !meeting.startTime ||
      !meeting.endTime ||
      !meeting.chairedBy
    ) {
      message.error("Please fill in all the required fields");
      return;
    }

    try {
      console.log(meeting);
      const values = await form.validateFields();
      const duration = calculateDuration(meeting.startTime, meeting.endTime);

      const highlights = values.highlights
        ? values.highlights.map(({ highlight, who }) => ({
            highlight,
            who,
          }))
        : [];

      const presents = values.presents
        ? values.presents.map(({ present, office, position }) => ({
            present,
            office,
            position,
          }))
        : [];

      const absents = values.absents
        ? values.absents.map(({ absent, office, position }) => ({
            absent,
            office,
            position,
          }))
        : [];

      const attendees = values.attendees
        ? values.attendees.map(({ attendee, office, position }) => ({
            attendee,
            office,
            position,
          }))
        : [];

      const updatedMeeting = {
        ...meeting,
        duration,
        highlights,
        presents,
        absents,
        attendees,
      };

      console.log(meeting);

      await axios.post("http://localhost:3333/minofmeet", updatedMeeting);
      closePopup();
      message.success(`Meeting added successfully.`);
      form.resetFields();
    } catch (err) {
      console.log(err);
    }
  };

  const [form] = Form.useForm();

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const closePopup = () => {
    setIsModalOpen(false);
  };

  const clearButtonFunction = () => {
    form.resetFields();
  };

  const initialValues = {
    timeRange: "Hardcoded Value",
  };

  const handleAttach = (info) => {
    if (info.file.status === "done") {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  const handleBeforeUpload = (file) => {
    setFileList([...fileList, file]);
    return false;
  };

  const handleRemove = (file) => {
    const updatedFileList = fileList.filter((f) => f !== file);
    setFileList(updatedFileList);
  };

  return (
    <div>
      <Button
        className="new-min"
        onClick={toggleModal}
        icon={<FontAwesomeIcon icon={faPlus} className="" />}
        style={{
          textTransform: "none",
          backgroundColor: "#2684FF",
          color: "#ffffff",
          border: "none",
        }}
      >
        <span> New Meeting</span>
      </Button>

      <Affix>
        <div>
          {window.innerWidth < 768 && (
            <FloatButton
              onClick={toggleModal}
              icon={<FontAwesomeIcon icon={faPlus} className="" />}
              shape="circle"
              type="primary"
              style={{ right: 14, bottom: 20, zIndex: 10 }}
            />
          )}
        </div>
      </Affix>

      <Modal
        title={
          <div
            style={{
              textAlign: "center",
              paddingBottom: "6px",
              fontWeight: "bold",
            }}
          >
            Add New Meeting
          </div>
        }
        open={isModalOpen}
        type="primary"
        onOk={handleClick}
        onCancel={closePopup}
        width={650}
        style={{ top: 100 }}
        footer={[
          <div
            key="footer"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <Button key="clear" onClick={clearButtonFunction}>
              Clear
            </Button>
            <div>
              <Button key="cancel" onClick={closePopup}>
                Cancel
              </Button>
              <Button key="save" onClick={handleClick}>
                Save
              </Button>
            </div>
          </div>,
        ]}
      >
        <Form
          form={form}
          onFinish={handleClick}
          initialValues={initialValues}
          width={700}
          className="overflow-y-auto max-h-[500px] custom-scrollbar"
        >
          <div className="mr-2">
            <Form.Item
              name="title"
              label="Subject"
              rules={[{ required: true, message: "Please enter a title" }]}
              hasFeedback
              onChange={(e) =>
                setMeeting({ ...meeting, title: e.target.value })
              }
            >
              <Input autoFocus placeholder="Title" />
            </Form.Item>

            <Form.Item
              name="venue"
              label="Venue"
              rules={[{ required: true, message: "Please enter Venue" }]}
              hasFeedback
              onChange={(e) =>
                setMeeting({ ...meeting, venue: e.target.value })
              }
            >
              <Input autoFocus placeholder="Venue" />
            </Form.Item>

            <Form.Item
              name="date"
              label="Date Conducted"
              rules={[{ required: true, message: "Please select a date" }]}
              hasFeedback
            >
              <DatePicker
                style={{ width: "100%" }}
                placeholder="Date"
                allowClear
                onChange={(date, dateString) =>
                  setMeeting({ ...meeting, date: dateString })
                }
              />
            </Form.Item>

            <div>
              <p className="font-bold mb-2"> A. Present during the meeting</p>
              <Form.List name="presents">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }) => (
                      <div className="flex">
                        <Space
                          key={key}
                          className="flex mb-4 sm:flex-row flex-col h-auto sm:h-4"
                          align="baseline"
                        >
                          <Form.Item {...restField} name={[name, "present"]}>
                            <Input placeholder="Name" />
                          </Form.Item>

                          <Form.Item {...restField} name={[name, "office"]}>
                            <Input placeholder="Office" />
                          </Form.Item>

                          <Form.Item {...restField} name={[name, "position"]}>
                            <Input placeholder="Position" />
                          </Form.Item>
                        </Space>
                        <Button
                          className="ml-2 self-center"
                          onClick={() => remove(name)}
                          icon={<MinusCircleOutlined />}
                          danger
                          style={{ borderColor: "transparent" }}
                        ></Button>
                      </div>
                    ))}
                    <Form.Item>
                      <Button
                        className="mt-2"
                        type="dashed"
                        onClick={() => add()}
                        icon={<PlusOutlined />}
                      >
                        Add Present
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>
            </div>

            <div>
              <p className="font-bold mb-2">
                {" "}
                B. Absent during the meeting (where appropiate, indicate reason
                for absence)
              </p>
              <Form.List name="absents">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }) => (
                      <div className="flex">
                        <Space
                          key={key}
                          className="flex mb-4 sm:flex-row flex-col h-auto sm:h-4"
                          align="baseline"
                        >
                          <Form.Item {...restField} name={[name, "absent"]}>
                            <Input placeholder="Name" />
                          </Form.Item>

                          <Form.Item {...restField} name={[name, "office"]}>
                            <Input placeholder="Office" />
                          </Form.Item>

                          <Form.Item {...restField} name={[name, "position"]}>
                            <Input placeholder="Position" />
                          </Form.Item>
                        </Space>
                        <Button
                          className="self-center ml-2"
                          onClick={() => remove(name)}
                          icon={<MinusCircleOutlined />}
                          danger
                          style={{ borderColor: "transparent" }}
                        ></Button>
                      </div>
                    ))}
                    <Form.Item>
                      <Button
                        type="dashed"
                        onClick={() => add()}
                        icon={<PlusOutlined />}
                      >
                        Add Absent
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>
            </div>

            <div>
              <p className="font-bold mb-2">
                {" "}
                C. Other attendees during the meeting
              </p>
              <Form.List name="attendees">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }) => (
                      <div className="flex">
                        <Space
                          key={key}
                          className="flex mb-4 sm:flex-row flex-col h-auto sm:h-4"
                          align="baseline"
                        >
                          <Form.Item {...restField} name={[name, "attendee"]}>
                            <Input placeholder="Name" />
                          </Form.Item>

                          <Form.Item {...restField} name={[name, "office"]}>
                            <Input placeholder="Office" />
                          </Form.Item>

                          <Form.Item {...restField} name={[name, "position"]}>
                            <Input placeholder="Position" />
                          </Form.Item>
                        </Space>
                        <Button
                          className="self-center ml-2"
                          onClick={() => remove(name)}
                          icon={<MinusCircleOutlined />}
                          danger
                          style={{ borderColor: "transparent" }}
                        ></Button>
                      </div>
                    ))}
                    <Form.Item>
                      <Button
                        type="dashed"
                        onClick={() => add()}
                        icon={<PlusOutlined />}
                      >
                        Add Other Attendee/s
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>
            </div>
            <div className="flex gap-2 sm:flex-row flex-col">
              <div className="flex sm:flex-row flex-col h-14 sm:h-auto">
                <p className="font-bold mt-1 mr-1 mb-2 sm:mb-0">
                  D. Chaired By:
                </p>
                <Form.Item
                  name="chairedBy"
                  rules={[
                    {
                      required: true,
                      message:
                        "Please enter the name of the person chairing the meeting",
                    },
                  ]}
                  hasFeedback
                  onChange={(e) =>
                    setMeeting({ ...meeting, chairedBy: e.target.value })
                  }
                >
                  <Input autoFocus placeholder="Chaired By" />
                </Form.Item>
              </div>

              <div className="flex sm:flex-row flex-col h-[80px] sm:h-auto">
                <p className="font-bold mt-1 mr-1 mb-2 sm:mb-0">
                  Time Started:
                </p>
                <Form.Item
                  name="timeRange"
                  rules={[
                    { required: true, message: "Select Start and End Date" },
                  ]}
                >
                  <div className="flex">
                    <Form.Item
                      name="startTime"
                      rules={[
                        {
                          required: true,
                          message: "Please select a start time",
                        },
                      ]}
                      hasFeedback
                      className="side-by-side"
                      style={{ width: "160px" }}
                    >
                      <TimePicker
                        format="h:mm A"
                        placeholder="Start Time"
                        allowClear
                        onChange={(time, timeString) =>
                          setMeeting({ ...meeting, startTime: timeString })
                        }
                        className="custom-time-picker w-full"
                      />
                    </Form.Item>
                  </div>
                </Form.Item>
              </div>
            </div>
            <div>
              <p className="font-bold mb-2"> E. Highlights of the Meeting</p>
              <Form.List name="highlights">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }) => (
                      <div className="flex h-auto sm:h-36">
                        <Space
                          key={key}
                          className="flex mb-4 gap-0 sm:gap-4 sm:flex-row flex-col"
                          align="baseline"
                        >
                          <Form.Item {...restField} name={[name, "highlight"]}>
                            <div>
                              <p className="font-medium text-center mb-1">
                                Agenda / Highlights
                              </p>
                              <Input.TextArea
                                placeholder="Highlight"
                                className="w-52 sm:w-72"
                                rows={4}
                                allowClear
                              />
                            </div>
                          </Form.Item>

                          <Form.Item {...restField} name={[name, "who"]}>
                            <div className="">
                              <p className="font-medium text-center mb-1">
                                Who / When
                              </p>
                              <Input placeholder="Who" />
                            </div>
                          </Form.Item>
                        </Space>
                        <Button
                          className="self-center"
                          onClick={() => remove(name)}
                          icon={<MinusCircleOutlined />}
                          danger
                          style={{ borderColor: "transparent" }}
                        ></Button>
                      </div>
                    ))}
                    <Form.Item>
                      <Button
                        type="dashed"
                        onClick={() => add()}
                        icon={<PlusOutlined />}
                      >
                        Add Highlights
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>
            </div>
            <div className="flex sm:flex-row flex-col">
              <p className="font-bold mr-1 mt-1 sm:mb-0 mb-2">
                F. Time Adjourned:
              </p>
              <Form.Item
                name="endTime"
                rules={[
                  { required: true, message: "Please select an end time" },
                ]}
                hasFeedback
                className="side-by-side"
                style={{ width: "160px" }}
              >
                <TimePicker
                  format="h:mm A"
                  placeholder="End Time"
                  allowClear
                  onChange={(time, timeString) =>
                    setMeeting({ ...meeting, endTime: timeString })
                  }
                  className="custom-time-picker w-full"
                />
              </Form.Item>
            </div>
          </div>
        </Form>
      </Modal>
    </div>
  );
}

export default AddMeet;
