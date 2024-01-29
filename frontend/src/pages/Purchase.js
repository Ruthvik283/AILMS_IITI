import React, { useState, useEffect } from "react";
import Footer2 from "../components/Footer";
import Navbar from "../components/Navbar";
import PurchaseTable from "../components/PurchaseTable";
import { Link } from 'react-router-dom';

export default function Purchase() {
  return (
    <>
      <Navbar></Navbar>
      <div className="addpurchase">
        <Link
          to="/purchaseform"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Add Purchase
        </Link>
      </div>

      <PurchaseTable />

      <Footer2></Footer2>
    </>
  );
}
