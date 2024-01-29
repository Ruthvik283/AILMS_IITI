import React, { useState, useEffect } from "react";
import Footer2 from "../components/Footer";
import Navbar from "../components/Navbar";
import SanctionTable from "../components/SanctionTable";
import { Link } from "react-router-dom";

export default function SanctionFormPage() {
  return (
    <>
      <Navbar></Navbar>
      <div className="min-h-screen">
        <SanctionTable />
        <div className="pt-10">
          <Link
            to="/sanctionform"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Add Sanction
          </Link>
        </div>
      </div>
      <Footer2></Footer2>
    </>
  );
}