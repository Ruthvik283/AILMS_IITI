import React, { useContext, useEffect } from "react";
import { motion } from "framer-motion";
import Typed from "typed.js";
import { useNavigate } from "react-router-dom";
import Footer2 from "../components/Footer";
import Navbar from "../components/Navbar";
import AuthContext from "../context/AuthContext";

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
    <>
      <div
        className="fixed inset-0 w-screen h-screen z-0"
        style={{
          backgroundImage:
            "url('https://static.janbharattimes.com/wp-content/uploads/2023/06/IIT-Indore.jpg')",
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
        <div className="content-container text-center pt-16">
          <img
            src="https://upload.wikimedia.org/wikipedia/en/c/c4/Indian_Institute_of_Technology%2C_Indore_Logo.png?20190402045212"
            alt="IIT Indore Logo"
            className="mx-auto mb-2"
            style={{ width: "20%" }} // Adjust the width as needed
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
    </>
  );
}
