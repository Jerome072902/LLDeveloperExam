import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { Input, Button, Form, message } from "antd";
import "./RegStyles.css";
import axios from "axios";

function Register() {
  const [form] = Form.useForm();
  const [buttonClicked, setButtonClicked] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const [emailReg, setEmailReg] = useState("");
  const [passwordReg, setPasswordReg] = useState("");

  const register = () => {
    axios
      .post("http://localhost:3333/register", {
        email: emailReg,
        password: passwordReg,
      })
      .then((response) => {
        message.success("Registration successful");
        console.log(response);
        navigate("/login");
      });
  };

  return (
    <div className="register-container">
      <div className="reg-form border border-gray-300 shadow-md">
        <h1 className="font-medium py-2 dark:text-black">
          Register to your Account
        </h1>

        <Form form={form}>
          <div className="flex flex-col w-72 ">
            <div className="">
              {errorMessage && (
                <div className="error-message">
                  <p className="">{errorMessage}</p>
                  <button className="close-button" onClick={handleCloseError}>
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </div>
              )}
            </div>
            <Form.Item
              name="email"
              rules={[
                {
                  validator: (_, value) => {
                    if (!value) {
                      return Promise.reject("Please enter your email");
                    }
                    if (value.includes(" ")) {
                      return Promise.reject("Email cannot contain spaces");
                    }
                    if (!value.includes("@")) {
                      return Promise.reject("Email must contain @");
                    }
                    if (value.length > 100) {
                      return Promise.reject(
                        "Email is too long (maximum 100 characters)"
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
              hasFeedback
            >
              <Input
                placeholder="Email"
                style={{ padding: "8px" }}
                onChange={(e) => {
                  setEmailReg(e.target.value);
                }}
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please enter your password",
                },
              ]}
              hasFeedback
            >
              <Input.Password
                placeholder="Password"
                style={{ padding: "8px" }}
                onChange={(e) => {
                  setPasswordReg(e.target.value);
                }}
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              rules={[
                {
                  required: true,
                  message: "Please confirm your password",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      "The two passwords that you entered does not match."
                    );
                  },
                }),
              ]}
              hasFeedback
            >
              <Input.Password
                placeholder="Confirm Password"
                style={{ padding: "8px" }}
              />
            </Form.Item>
          </div>
          <div className="flex justify-center p-2">
            <Button type="primary" onClick={register} loading={buttonClicked}>
              Register
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default Register;
