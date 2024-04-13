import React, { useState, useEffect } from "react";
import Footer2 from "../components/Footer";
import Navbar from "../components/Navbar";
import SanctionTable from "../components/SanctionTable";
import { Link } from "react-router-dom";

export default function SanctionFormPage() {
  useEffect(() => {
    document.title = "Sanction- AILMS";
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
    <div className="bg-[#FFFEFA]">
      <Navbar></Navbar>
      <div className="min-h-screen">
        <SanctionTable />
        <div className="px-4 pb-4">
          <Link
            to="/sanctionform"
            className="bg-[#3c50e0] hover:bg-[#6272e6] text-white font-bold py-2 px-4 rounded"
          >
            Add Sanction
          </Link>
        </div>
      </div>
      
      <Footer2></Footer2>
      
      </div>
    </>
  );
}
