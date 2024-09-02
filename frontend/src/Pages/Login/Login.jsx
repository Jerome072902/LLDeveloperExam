import React, { useEffect, useState, useRef, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { Form, Button, Input } from "antd";
import { message } from "antd";
import axios from "axios";
import { AuthContext } from "../../Components/Context/AuthContext";
import "./styles.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [buttonClicked, setButtonClicked] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const { setAuth } = useContext(AuthContext);

  axios.defaults.withCredentials = true;

  const login = () => {
    axios
      .post(
        "http://localhost:3333/login",
        {
          email: email,
          password: password,
        },
        { withCredentials: true }
      )
      .then((response) => {
        if (response.data.message) {
          setErrorMessage(response.data.message);
        } else {
          const userData = response.data;
          setAuth({ loggedIn: true, user: userData });
          message.success("Login successful, Welcome!");
          navigate("/");
        }
      })
      .catch((error) => {
        console.error("There was an error logging in:", error);
        setErrorMessage(
          "An error occurred while trying to log in. Please try again."
        );
      });
  };

  const handleCloseError = () => {
    setErrorMessage("");
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      // handleLogin();
    }
  };

  return (
    <div className="login-container">
      <div className="left-section w-[70%]">
        <p className="text-white font-medium absolute left-20 top-48 text-lg z-50 welcome-text">
          Welcome to
        </p>
        <p className="text-[#ffb728] font-medium absolute left-20 top-56 text-6xl z-50 drop-shadow-xl trans">
          Minutes of Meeting Reports Generator
        </p>
      </div>
      <div className="right-section ">
        <div className="circle-container drop-shadow-md"></div>
        <div className="smallcircle-container flex-1"></div>
        <div className="mt-3">
          <div className="ml-6 flex flex-col pb-3 gap-2 mt-4">
            <p className="text-sm sm:text-2xl font-roboto font-normal mt-4 sm:font-bold text-slate-800 ">
              Login to your Account
            </p>
          </div>
          <div className="flex flex-col justify-center">
            <div className="login-form flex-col justify-center z-10 rounded-md px-6 pt-2">
              <div className="">
                {errorMessage && (
                  <div className="error-message flex justify-between">
                    <p className="text-sm">{errorMessage}</p>
                    <button className="close-button" onClick={handleCloseError}>
                      <FontAwesomeIcon icon={faTimes} />
                    </button>
                  </div>
                )}
              </div>
              <Form name="loginForm" onFinish={login} labelCol={{ span: 24 }}>
                {" "}
                <span className="ml-3">Email</span>
                <Form.Item
                  name="email	"
                  rules={[
                    {
                      validator: (_, value) => {
                        if (!value) {
                          return Promise.reject("Please enter your email");
                        }
                        if (!value.includes("@")) {
                          return Promise.reject("Email must contain @");
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
                  hasFeedback
                >
                  <Input
                    className="em"
                    placeholder="Enter your Email"
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ width: "100%" }}
                  />
                </Form.Item>
                <span className="ml-3">Password</span>
                <Form.Item
                  name="password"
                  style={{ marginBottom: "8px" }}
                  rules={[
                    {
                      required: true,
                      message: "Please enter your password",
                    },
                  ]}
                  hasFeedback
                >
                  <Input.Password
                    className="pw"
                    type="password"
                    placeholder="Enter Password"
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ width: "100%" }}
                  />
                </Form.Item>
                <Form.Item>
                  <div className="flex justify-end ">
                    <Link to="/forgot-password">
                      <div className="cursor-pointer font-roboto text-xs text-blue-500 hover:underline">
                        Forgot Password?
                      </div>
                    </Link>
                  </div>
                </Form.Item>
                <Form.Item>
                  <div className="flex justify-center font-roboto">
                    <Button
                      type="primary"
                      htmlType="submit"
                      className={buttonClicked ? "clicked" : ""}
                    >
                      Log In
                    </Button>
                  </div>
                </Form.Item>
              </Form>
              <div className="flex justify-center">
                <div className="text-xs font-roboto flex flex-row gap-1 dark:text-black font-[500]">
                  Dont Have an Account?{" "}
                  <div className="font-medium text-blue-600">
                    {" "}
                    <Link to="/register">Register Here</Link>
                  </div>
                  .
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
