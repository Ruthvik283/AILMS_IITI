import React, { useState, useEffect } from "react";
import Footer2 from "../components/Footer";
import Navbar from "../components/Navbar";
import SanctionTable from "../components/SanctionTable";
import { Link } from "react-router-dom";

export default function SanctionFormPage() {
  return (
    <>
    <div className="bg-[#c8d8d4]">
      <Navbar></Navbar>
      <div className="min-h-screen">
        <SanctionTable />
        <div className="pt-8 px-4 pb-4">
          <Link
            to="/sanctionform"
            className="bg-[#52ab98] hover:bg-[#2b6777] text-white font-bold py-2 px-4 rounded"
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
