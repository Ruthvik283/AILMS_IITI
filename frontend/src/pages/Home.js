import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom
import Footer2 from "../components/Footer";
import Navbar from "../components/Navbar";
import AuthContext from "../context/AuthContext";

export default function Home() {
  const navigate = useNavigate(); // Use useNavigate hook for navigation
  const contextData = useContext(AuthContext);

  let { logoutUser } = useContext(AuthContext)
  useEffect(() => {
    const isEngineer = false;
    

    if (contextData.userData.id === null) {
      logoutUser();
    }
    else if (contextData.userData.role === "Engineer") {
      navigate("/engineer");
    }
  }, [navigate]);
  return (
    <>
      <div className="min-h-screen">
        <Navbar />
        <div className="bg-slate-300 min-h-screen text-center">
          Welcome to Home page
        </div>
      </div>
      <Footer2 />
    </>
  );
}
