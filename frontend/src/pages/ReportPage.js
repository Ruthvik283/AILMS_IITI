import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom
import Footer2 from "../components/Footer";
import Navbar from "../components/Navbar";
import AuthContext from "../context/AuthContext";
import Report from "../components/Report";

export default function ReportPage() {

  return (
    <>
      <div className=" bg-[#f2f2f2] min-h-screen">
        <Navbar />
        <Report/>
      </div>
      <Footer2 />
    </>
  );
}