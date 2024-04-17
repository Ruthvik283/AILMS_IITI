import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../context/AuthContext";
import { Link, useLocation } from "react-router-dom";
import { Icon } from "react-icons-kit";
import { eyeOff } from "react-icons-kit/feather/eyeOff";
import { eye } from "react-icons-kit/feather/eye";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const VerificationPopup = ({ onConfirm, onCancel }) => {
  const [verificationCode, setVerificationCode] = useState("");

  const handleConfirm = () => {
    onConfirm(verificationCode);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Enter Verification Code</h2>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="mb-4">
          <input
            type="text"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
            placeholder="Enter verification code"
          />
        </div>
        <div className="flex justify-end">
          <button
            onClick={handleConfirm}
            className="bg-green-500 text-white py-2 px-4 rounded-full hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 mr-2"
          >
            Confirm
          </button>
          <button
            onClick={onCancel}
            className="bg-gray-300 text-gray-700 py-2 px-4 rounded-full hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const SignupPage = () => {
  const [password, setPassword] = useState("");
  const [type, setType] = useState("password");
  const [icon, setIcon] = useState(eyeOff);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [email, setEmail] = useState("");
  const Navigate = useNavigate();

  const handleToggle = () => {
    if (type === "password" && password != "") {
      setIcon(eye);
      setType("text");
    } else {
      setIcon(eyeOff);
      setType("password");
    }
  };

  const [showVerificationPopup, setShowVerificationPopup] = useState(false);

  const sendVerificationEmail = async () => {
    try {
      if (!email.endsWith("@iiti.ac.in")) {
        toast.error("Please login with institute email-id");
        return; // Stop further execution
      }
      toast.success("Sending verification email")

      const response = await axios.post("/api/send-verification-email/", {
        email,
      });

      if (response.status === 201) {
        setShowVerificationPopup(true);
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred while sending the verification email");
    }
  };

  const verifyEmail = async (code) => {
    try {
      const response = await axios.post("/api/verify-email/", {
        email,
        code,
      });

      if (response.status === 200) {
        setIsEmailVerified(true);
        toast.success("Email verified successfully");
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred while verifying the email");
    } finally {
      setShowVerificationPopup(false);
    }
  };

  const handleVerificationConfirm = (code) => {
    verifyEmail(code);
  };

  const handleVerificationCancel = () => {
    setShowVerificationPopup(false);
  };

  useEffect(() => {
    setP(password);

    if (password === "") {
      document.querySelector("#password_btn").classList.add("opacity-0");
      setIcon(eyeOff);
      setType("password");
    } else {
      document.querySelector("#password_btn").classList.remove("opacity-0");
    }
  }, [password]);

  let contextData = useContext(AuthContext);
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const username = e.target.elements.username.value;
    const email = e.target.elements.email.value;
    const department = e.target.elements.department.value;
    const confirmPassword = e.target.elements.confirmpassword.value;

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (!isEmailVerified) {
      toast.error("Please verify your email before submitting the form");
      return;
    }

    try {
      const response = await axios.post("/api/add_register_request/", {
        username: username,
        email: email,
        password: password,
        department: department,
      });

      if (response.status === 201) {
        toast.success("Register request has been sent");
        setIsEmailVerified(false);
        e.target.reset();
        setPassword("");
        setC("");
        setP("");
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred while registering user");
    }
  };

  useEffect(() => {
    document.title = "Sign Up - AILMS";
    window.scrollTo(0, 0);
  }, []);

  const [p, setP] = useState("");
  const [c, setC] = useState("");
  useEffect(() => {
    if (p === c) {
      document.querySelector("#diff_passwords").classList.add("opacity-0");
    } else {
      document.querySelector("#diff_passwords").classList.remove("opacity-0");
    }
  }, [p, c]);

  return (
    <>
      <div className=" min-h-screen py-[3%] flex flex-col justify-center bg-gray-300">
        <div className="flex justify-center main md:mt-0 mt-2 w-full md:w-[100%]">
          <div className="my-auto px-[0%] md:px-[0%]">
            <div className="bg-black m-auto  text-white rounded-lg md:flex  shadow-2xl">
              <div className="md:w-[100%] h-[50%]  bg-white rounded-lg p-10">
                <form onSubmit={handleSubmit}>
                  <div className="text-center">
                    <img
                      className="mx-auto md:h-32 h-[10%]"
                      src="https://upload.wikimedia.org/wikipedia/en/c/c4/Indian_Institute_of_Technology%2C_Indore_Logo.png?20190402045212"
                      alt="logo"
                    />

                    <h4 className=" mb-[6%] mt-1 pb-1 text-xl font-semibold text-black ">
                      AILMS
                    </h4>

                    <h4 className="mb-[6%] mt-1 pb-1 text-xl font-semibold text-black">
                      Register-Request
                    </h4>

                    <h2 className="text-base md:text-xl text-black">
                      Enter your credentials:
                    </h2>
                    <div className="flex flex-col items-center gap-3 text-sm pt-5">
                      <div className="flex justify-center w-[100%]">
                        <input
                          required
                          className="w-3/4 shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          id="username"
                          type="text"
                          placeholder="Username"
                        />
                      </div>

                      <div className="flex justify-center w-[100%]">
                        <input
                          required
                          className="w-3/4 shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          id="email"
                          type="email"
                          placeholder="Email-id"
                          onChange={(e) => {
                            setEmail(e.target.value);
                            setIsEmailVerified(false);
                          }}
                        />
                      </div>
                      <div className="flex justify-center w-[100%]">
                        {isEmailVerified ? (
                          <button
                            className="w-3/4 rounded bg-green-500 text-white py-2 px-4 mt-2"
                            disabled
                          >
                            Email Verified
                          </button>
                        ) : (
                          <button
                            className="w-3/4 rounded bg-blue-500 text-white py-2 px-4 mt-2"
                            type="button"
                            onClick={sendVerificationEmail}
                          >
                            Send Verification Email
                          </button>
                        )}
                      </div>
                      <div className="text-gray-400  w-[100%]">
                        <select
                          id="department"
                          name="department"
                          className="w-3/4 shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline "
                        >
                          <option value="">Select department</option>
                          {contextData.departmentData.map((department) => (
                            <option
                              key={department.department_id}
                              value={department.department_id}
                            >
                              {department.department_name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="flex justify-center w-[100%]">
                        <span className="w-3/4 relative">
                          <input
                            className="w-full shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="password"
                            type={type}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                          />
                          <span
                            id="password_btn"
                            className="border-0 border-black absolute right-0"
                            onClick={handleToggle}
                          >
                            <Icon
                              className="text-gray-500 my-auto mr-3 mt-1"
                              icon={icon}
                              size={25}
                            />
                          </span>
                        </span>
                      </div>

                      <div className="flex justify-center w-[100%]">
                        <input
                          required
                          className="w-3/4 shadow appearance-none border  rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          id="confirmpassword"
                          type="password"
                          placeholder="Confirm Password"
                          onChange={(e) => setC(e.target.value)}
                        />
                      </div>

                      <p
                        className="text-red-400 mt-1 opacity-0"
                        id="diff_passwords"
                      >
                        Passwords don't match!
                      </p>
                    </div>
                  </div>
                  <div className="text-center pt-1 pb-5 ">
                    <button className="rounded h-10 w-3/4 btn1">
                      Send Request
                    </button>

                    <p className=" text-center text-sm my-[2%] pb-2 text-black">
                      Already have an account?
                      <span
                        className={
                          "px-[0.5rem] text-blue-500 hover:text-blue-300 hover:underline"
                        }
                        style={{ color: "#4169e1" }}
                      >
                        <Link
                          to="/login"
                          state={{ next_url: location.state?.next_url }}
                        >
                          Login
                        </Link>
                      </span>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx="true">
        {`
          .btn1 {
            background: #4169e1;
          }

          .svg-container {
            width: 80vw;
          }

          @media screen and (min-width: 768px) {
            .svg-container {
              width: 25vw;
            }
          }

          @media screen and (max-width: 768px) {
            .main {
              flex-direction: column;
            }
          }
        `}
      </style>

      {showVerificationPopup && (
        <VerificationPopup
          onConfirm={handleVerificationConfirm}
          onCancel={handleVerificationCancel}
        />
      )}
    </>
  );
};

export default SignupPage;