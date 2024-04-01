import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../context/AuthContext";
import { Link, useNavigate, useLocation } from "react-router-dom";

import { Icon } from "react-icons-kit";
import { eyeOff } from "react-icons-kit/feather/eyeOff";
import { eye } from "react-icons-kit/feather/eye";

import toast from "react-hot-toast";

const LoginPage = () => {
  const [password, setPassword] = useState("");
  const [type, setType] = useState("password");
  const [icon, setIcon] = useState(eyeOff);
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

  let { loginUser } = useContext(AuthContext);
  const contextData = useContext(AuthContext);
  const Navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // if(contextData.user!=null){
    //     Navigate('/')
    // }
    document.title = "Login - AILMS";
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = (e) => {
    const email = e.target.elements.email.value;

    // Check if the email ends with "@iiti.ac.in"
    if (!email.endsWith("@iiti.ac.in")) {
      e.preventDefault();
      toast.error("Please login with institute email-id");
      return; // Stop further execution
    } else {
      // To navigate to the page where an action was performed without logging in.
      loginUser(e, location.state?.next_url);
    }
  };

  return (
    <>
      <div className="min-h-screen flex flex-col py-[3%] justify-center bg-gray-300">
        <div className="flex justify-center main md:mt-0 mt-2">
          <div className="md:my-auto px-[5%] md:px-[10%] my-[4%]">
            <div className="bg-black m-auto  text-white rounded-lg md:flex  shadow-2xl">
              <div className=" md:w-[100%]  h-full  bg-white rounded-lg p-10">
                <form onSubmit={handleSubmit}>
                  <div className="text-center">
                    <img
                      className="mx-auto md:h-32 h-[5%]"
                      src="https://upload.wikimedia.org/wikipedia/en/c/c4/Indian_Institute_of_Technology%2C_Indore_Logo.png?20190402045212"
                      alt="logo"
                    />

                    <h4 className=" mb-[6%] mt-1 pb-1 text-xl font-semibold text-black ">
                      AILMS
                    </h4>

                    <h4 className="mb-[6%] mt-1 pb-1 text-xl font-semibold text-black">
                      Login
                    </h4>

                    <h2 className="text-base md:text-xl text-black">
                      Enter your credentials:
                    </h2>
                    <div className=" flex flex-col  items-center gap-3 text-sm pt-5">
                      <div className="flex justify-center w-[100%] ">
                        <input
                          className="w-3/4 shadow appearance-none  rounded py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          id="email"
                          type="email"
                          placeholder="Email-id"
                        />
                      </div>

                      <div className="flex justify-center w-[100%]">
                        <span className="w-3/4 relative">
                          <input
                            className="w-full shadow appearance-none  rounded py-3 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
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
                    </div>
                  </div>
                  <div className="text-center pt-4 pb-5 ">
                    <button className="rounded h-10 text-sm md:text-base w-[65%] btn1">
                      Continue
                    </button>
                  </div>
                </form>

                <p className="text-center text-sm my-[2%] pb-2 text-black">
                  <span
                    className={
                      "px-[0.5rem] text-blue-500 hover:text-blue-300 hover:underline"
                    }
                    style={{ color: "#4169e1" }}
                  >
                    <Link to="/signup">Sign Up</Link>
                  </span>
                  instead?
                </p>
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

export default LoginPage;
