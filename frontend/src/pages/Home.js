import React, { useState, useEffect } from "react";
import Footer2 from "../components/Footer";
import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <>
      <div className="min-h-screen">
        <Navbar></Navbar>

        <div className="bg-slate-300 min-h-screen text-center">
          Welcome to Home page
        </div>
      </div>
      <Footer2></Footer2>
    </>
  );
}
