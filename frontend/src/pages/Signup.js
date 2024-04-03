import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../context/AuthContext";
import { Link, useLocation } from "react-router-dom";
import { Icon } from "react-icons-kit";
import { eyeOff } from "react-icons-kit/feather/eyeOff";
import { eye } from "react-icons-kit/feather/eye";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SignupPage = () => {
  const [password, setPassword] = useState("");
  const [type, setType] = useState("password");
  const [icon, setIcon] = useState(eyeOff);
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
  useEffect(() => {
    setP(password);

    if (password === "") {
      document.querySelector("#password_btn").classList.add("opacity-0");
      setIcon(eyeOff);
      setType("password");
      //document.querySelector("#password_btn").removeEventListener('click', handleToggle);
    } else {
      document.querySelector("#password_btn").classList.remove("opacity-0");
      //document.querySelector("#password_btn").addEventListener('click', handleToggle);
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

    // Check if passwords match
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    // Make a POST request to the add_register_request endpoint
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/add_register_request/",
        {
          username: username,
          email: email,
          password: password,
          department: department,
        }
      );

      if (response.status === 201) {
        toast.success("Register request has been sent");
        e.target.reset();
        //Navigate("/"); // Redirect to homepage or any desired route
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
    // if (contextData.userData.role !== "Manager") {
    //   toast.error("Only admin can permit user registration");
    //   Navigate("/login");
    // }
    window.scrollTo(0, 0);
  }, []);

  const [p, setP] = useState("");
  const [c, setC] = useState("");
  useEffect(() => {
    if (p === c) {
      document.querySelector("#diff_passwords").classList.add("opacity-0");
      //document.querySelector("#confirmpassword").classList.add('mb3')
      ////console.log(document.querySelector("#confirmpassword").classList)
      // //console.log('matched')
    } else {
      document.querySelector("#diff_passwords").classList.remove("opacity-0");
      //document.querySelector("#confirmpassword").classList.remove('mb3')
      // document.querySelector("#confirmpassword").classList.remove('mb3')
      // //console.log(document.querySelector("#confirmpassword").classList)
      // //console.log('different')
    }
  }, [p, c]);
  return (
    <>
      <div className=" min-h-screen py-[3%] flex flex-col justify-center bg-gray-300">
        {/* <Link to="/" className="sticky top-[2%]">
          <div className="flex justify-end mr-[2%] z-50">
            <button className="py-2 px-4 absolute top-[2%] text-black text-base font-bold rounded-[50px] overflow-hidden bg-white transition-all duration-400 ease-in-out shadow-md hover:scale-105 hover:text-white hover:shadow-lg active:scale-90 before:absolute before:top-0 before:-left-full before:w-full before:h-full before:bg-gradient-to-r before:from-blue-800 before:to-blue-400 before:transition-all before:duration-500 before:ease-in-out before:z-[-1] before:rounded-[50px] hover:before:left-0">
              Skip Login »
            </button>
          </div>
        </Link> */}
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
                        />
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
    </>
  );
};

export default SignupPage;
