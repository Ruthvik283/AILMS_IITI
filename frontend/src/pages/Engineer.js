import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom
import Footer2 from "../components/Footer";
import Navbar from "../components/Navbar";
import AuthContext from "../context/AuthContext";

export default function Home() {
  const navigate = useNavigate(); // Use useNavigate hook for navigation
  const contextData = useContext(AuthContext);

  useEffect(() => {
    //const isEngineer = false;
    console.log("At engineerpage, but role-> ", contextData.userData.role);

    if (contextData.userData.role === "Manager") {
      navigate("/");
    }
  }, [navigate]);
  return (
    <>
      <div className="min-h-screen">
        <Navbar />
        <div className="bg-slate-100 min-h-screen text-center">
          Welcome to ENGINEER page
        </div>
      </div>
      <Footer2 />
    </>
  );
}
