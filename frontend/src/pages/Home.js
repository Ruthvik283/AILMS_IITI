import React, { useContext, useEffect } from "react";
import { motion } from "framer-motion";
import Typed from "typed.js";
import { useNavigate } from "react-router-dom";
import Footer2 from "../components/Footer";
import Navbar from "../components/Navbar";
import AuthContext from "../context/AuthContext";
import backgroundImage from './IITI_bg.jpg';
import IITILogo from './IITI_logo.png';

export default function Home() {
  const navigate = useNavigate();
  const { userData, logoutUser } = useContext(AuthContext);

  useEffect(() => {
    document.title = "Home - AILMS";
    window.scrollTo(0, 0);
  }, []);


  useEffect(() => {
    if (!userData.id) {
      logoutUser();
    }
    // else if (userData.role === "Engineer") {
    //   navigate("/engineer");
    // }

    // Initialize Typed.js
    const typedText = new Typed("#typed-text", {
      strings: ["Welcome to AILMS"],

      typeSpeed: 50,
      showCursor: false,
      onComplete: function () { },
    });

    return () => {
      // Destroy Typed.js instance on unmount to prevent memory leaks
      typedText.destroy();
    };
  }, [userData, navigate, logoutUser]);

  return (
    <div className="user-select-none">
      <div
        className="fixed inset-0 w-screen h-screen z-0"
        style={{
          backgroundImage:
            `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <motion.div
        className="relative z-10"
      // initial={{ opacity: 0 }}
      // animate={{ opacity: 1 }}
      // transition={{ duration: 1 }}
      >
        <Navbar />
        <div className=" content-container text-center pt-16">
          <img
            src={IITILogo}
            alt="IIT Indore Logo"
            className="mx-auto mb-2 p-5 backdrop-blur-md shadow-lg bg-white/20 rounded-lg w-3/4 md:w-1/5" 
            //style={{ width: "20%" }} // Adjust the width as needed
          />
          <h1
            id="typed-text"
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-white"
            style={{ fontSize: "250%" }} // Adjust the font size as needed
          ></h1>
          <h1
            id="typed-iit-text"
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-white"
            style={{ fontSize: "250%", visibility: "hidden" }} // Adjust the font size as needed
          ></h1>
        </div>
      </motion.div>

      <Footer2 />
    </div>
  );
}
