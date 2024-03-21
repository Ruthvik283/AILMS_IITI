import React, { useState, useEffect } from "react";
import Footer2 from "../components/Footer";
import Navbar from "../components/Navbar";
import PurchaseTable from "../components/PurchaseTable";
import { Link } from "react-router-dom";

export default function Purchase() {
  return (
    <>
    <div className="bg-[#c8d8d4]">
      <Navbar></Navbar>
      <div className="min-h-screen">
        <PurchaseTable />
        <div className="pt-5 pb-5">
          <Link
            to="/purchaseform"
            className="bg-[#52ab98] hover:bg-[#2b6777] text-white font-bold py-2 px-4 rounded"
          >
            Add Purchase
          </Link>
        </div>
      </div>
      <Footer2></Footer2>
      </div>
    </>
  );
}
