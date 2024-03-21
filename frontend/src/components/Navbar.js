"use client";
import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const contextData = useContext(AuthContext);
  const userData = contextData.userData;
  const { logoutUser } = useContext(AuthContext);

  const handleLogout = () => {
    logoutUser();
  };

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div className="container relative m-auto p-3 flex justify-between items-center bg-white max-w-screen-2xl">
      <h1 className="font-xl font-bold text-black pl-5">
        AILMS: {userData.username}
      </h1>
      <nav className={isOpen ? "flex" : "hidden md:flex space-x-4"}>
        <div className="flex bg-white absolute md:relative flex-col md:flex-row w-full shadow md:shadow-none text-center top-12 left-0 md:top-0 md:flex">
          <Link
            to="/"
            activeClassName="text-yellow-400"
            className="px-3 py-2 cursor-pointer rounded hover:underline text-black bg-inherit"
          >
            Home
          </Link>
          <Link
            to="/material"
            activeClassName="underline"
            className="px-3 py-2 cursor-pointer rounded text-black hover:underline bg-inherit"
            
          >
            MaterialsTable
          </Link>
          <Link
            to="/materials"
            activeClassName="text-yellow-400"
            className="px-3 py-2 cursor-pointer rounded hover:underline text-black bg-inherit"
          >
            Materials
          </Link>
          <Link
            to="/sanction"
            activeClassName="text-yellow-400"
            className="px-3 py-2 cursor-pointer rounded hover:underline text-black bg-inherit"
          >
            Sanctions
          </Link>
          <Link
            to="/purchase"
            activeClassName="text-yellow-400"
            className="px-3 py-2 cursor-pointer rounded hover:underline text-black bg-inherit"
          >
            Purchases
          </Link>
          <Link
            to="/Report"
            activeClassName="text-yellow-400"
            className="px-3 py-2 cursor-pointer rounded hover:underline text-black bg-inherit"
          >
            Report
          </Link>
          <button
            onClick={handleLogout}
            className="px-3 py-2 cursor-pointer rounded hover:underline text-black bg-inherit"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="md:hidden bg-[#00203FFF]">
        <button
          className="flex justify-center items-center"
          onClick={toggleNavbar}
        >
          <svg
            viewBox="0 0 24 24"
            width="24"
            height="24"
            stroke="white"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={isOpen ? "hidden" : "flex"}
          >
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
          <svg
            viewBox="0 0 24 24"
            width="24"
            height="24"
            stroke="white"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={isOpen ? "flex" : "hidden"}
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    </div>
  );
}
export default Navbar;

