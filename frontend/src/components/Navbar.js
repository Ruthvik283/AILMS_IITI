"use client";
import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const contextData = useContext(AuthContext);
  //   const userData = contextData.userData;
  const { logoutUser } = useContext(AuthContext);

  const handleLogout = () => {
    logoutUser();
  };

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  {
    //console.log("role Navbar",contextData.userData.role)
    if (contextData.userData.role == "Manager") {
      //This is manager's Navbar
      //In the else you can find engineer's Navbar
      return (
        <nav className="bg-[#1c2434]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                {/* <h1 className="text-white font-bold text-xl">
                  AILMS: {userData.username}
                </h1> */}
                <div className="">
                  <div className="container flex flex-shrink-0 items-center">
                    <Link to="/">
                      <img
                        className="w-auto max-w-full h-auto"
                        src={require("./Logo1-removebg.png")}
                        alt="Your Company"
                        style={{ maxWidth: "150px" }} // Set the maximum width here
                      />
                    </Link>
                  </div>
                </div>
              </div>
              <div className="hidden custom-md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  <Link
                    to="/"
                    activeClassName="text-white bg-gray-900 hover:bg-gray-700"
                    className="text-white hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Home
                  </Link>
                  <Link
                    to="/material"
                    activeClassName="text-white bg-gray-900 hover:bg-gray-700"
                    className="text-white hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    MaterialsTable
                  </Link>
                  <Link
                    to="/materials"
                    activeClassName="text-white bg-gray-900 hover:bg-gray-700"
                    className="text-white hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Materials
                  </Link>
                  <Link
                    to="/sanction"
                    activeClassName="text-white bg-gray-900 hover:bg-gray-700"
                    className="text-white hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Approvals
                  </Link>
                  <Link
                    to="/purchase"
                    activeClassName="text-white bg-gray-900 hover:bg-gray-700"
                    className="text-white hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Purchases
                  </Link>
                  <Link
                    to="/Departments"
                    activeClassName="text-white bg-gray-900 hover:bg-gray-700"
                    className="text-white hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Departments
                  </Link>
                  <Link
                    to="/users"
                    activeClassName="text-white bg-gray-900 hover:bg-gray-700"
                    className="text-white hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Users
                  </Link>
                  <Link
                    to="/Report"
                    activeClassName="text-white bg-gray-900 hover:bg-gray-700"
                    className="text-white hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Report
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-white hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Logout
                  </button>
                </div>
              </div>
              <div className="-mr-2 flex custom-md:hidden">
                <button
                  onClick={toggleNavbar}
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-200 hover:bg-gray-700 focus:outline-none focus:bg-gray-700 focus:text-white transition duration-150 ease-in-out"
                >
                  <svg
                    className={`${isOpen ? "hidden" : "block"} h-6 w-6`}
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                  <svg
                    className={`${isOpen ? "block" : "hidden"} h-6 w-6`}
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <div className={`${isOpen ? "block" : "hidden"} custom-md:hidden`}>
            <div className="px-2 pt-2 pb-3 sm:px-3">
              <Link
                to="/"
                activeClassName="bg-gray-900 text-white"
                className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-gray-200 hover:bg-gray-700"
              >
                Home
              </Link>
              <Link
                to="/material"
                activeClassName="bg-gray-900 text-white"
                className="mt-1 block px-3 py-2 rounded-md text-base font-medium text-white hover:text-gray-200 hover:bg-gray-700"
              >
                MaterialsTable
              </Link>
              <Link
                to="/materials"
                activeClassName="bg-gray-900 text-white"
                className="mt-1 block px-3 py-2 rounded-md text-base font-medium text-white hover:text-gray-200 hover:bg-gray-700"
              >
                Materials
              </Link>
              <Link
                to="/sanction"
                activeClassName="bg-gray-900 text-white"
                className="mt-1 block px-3 py-2 rounded-md text-base font-medium text-white hover:text-gray-200 hover:bg-gray-700"
              >
                Approvals
              </Link>
              <Link
                to="/purchase"
                activeClassName="bg-gray-900 text-white"
                className="mt-1 block px-3 py-2 rounded-md text-base font-medium text-white hover:text-gray-200 hover:bg-gray-700"
              >
                Purchases
              </Link>
              <Link
                to="/Departments"
                activeClassName="bg-gray-900 text-white"
                className="mt-1 block px-3 py-2 rounded-md text-base font-medium text-white hover:text-gray-200 hover:bg-gray-700"
              >
                Departments
              </Link>
              <Link
                to="/users"
                activeClassName="bg-gray-900 text-white"
                className="mt-1 block px-3 py-2 rounded-md text-base font-medium text-white hover:text-gray-200 hover:bg-gray-700"
              >
                Users
              </Link>
              <Link
                to="/Report"
                activeClassName="bg-gray-900 text-white"
                className="mt-1 block px-3 py-2 rounded-md text-base font-medium text-white hover:text-gray-200 hover:bg-gray-700"
              >
                Report
              </Link>
              <button
                onClick={handleLogout}
                className="mt-1 block px-3 py-2 rounded-md text-base font-medium text-white hover:text-gray-200 hover:bg-gray-700"
              >
                Logout
              </button>
            </div>
          </div>
        </nav>
      );
    } else {
      return (
        <nav className="bg-gray-800">
          <div className="max-w-7xl m-auto px-4 sm:px-6 lg:px-4">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-white font-bold text-xl">
                  AILMS: {contextData.userData.username}
                </h1>
              </div>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  <Link
                    to="/"
                    activeClassName="text-white bg-gray-900 hover:bg-gray-700"
                    className="text-white hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Home
                  </Link>
                  {/* <Link
                    to="/material"
                    activeClassName="text-white bg-gray-900 hover:bg-gray-700"
                    className="text-white hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    MaterialsTable
                  </Link>
                  <Link
                    to="/materials"
                    activeClassName="text-white bg-gray-900 hover:bg-gray-700"
                    className="text-white hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Materials
                  </Link> */}
                  <Link
                    to="/sanction"
                    activeClassName="text-white bg-gray-900 hover:bg-gray-700"
                    className="text-white hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Your Approvals
                  </Link>
                  {/* <Link
                    to="/purchase"
                    activeClassName="text-white bg-gray-900 hover:bg-gray-700"
                    className="text-white hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Purchases
                  </Link> */}
                  {/* <Link
                    to="/Report"
                    activeClassName="text-white bg-gray-900 hover:bg-gray-700"
                    className="text-white hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Report
                  </Link> */}
                  <button
                    onClick={handleLogout}
                    className="text-white hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Logout
                  </button>
                </div>
              </div>
              <div className="-mr-2 flex md:hidden">
                <button
                  onClick={toggleNavbar}
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-200 hover:bg-gray-700 focus:outline-none focus:bg-gray-700 focus:text-white transition duration-150 ease-in-out"
                >
                  <svg
                    className={`${isOpen ? "hidden" : "block"} h-6 w-6`}
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                  <svg
                    className={`${isOpen ? "block" : "hidden"} h-6 w-6`}
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <div className={`${isOpen ? "block" : "hidden"} md:hidden`}>
            <div className="px-2 pt-2 pb-3 sm:px-3">
              <Link
                to="/"
                activeClassName="bg-gray-900 text-white"
                className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-gray-200 hover:bg-gray-700"
              >
                Home
              </Link>
              {/* <Link
                to="/material"
                activeClassName="bg-gray-900 text-white"
                className="mt-1 block px-3 py-2 rounded-md text-base font-medium text-white hover:text-gray-200 hover:bg-gray-700"
              >
                MaterialsTable
              </Link>
              <Link
                to="/materials"
                activeClassName="bg-gray-900 text-white"
                className="mt-1 block px-3 py-2 rounded-md text-base font-medium text-white hover:text-gray-200 hover:bg-gray-700"
              >
                Materials
              </Link> */}
              <Link
                to="/sanction"
                activeClassName="bg-gray-900 text-white"
                className="mt-1 block px-3 py-2 rounded-md text-base font-medium text-white hover:text-gray-200 hover:bg-gray-700"
              >
                Your Approvals
              </Link>
              {/* <Link
                to="/purchase"
                activeClassName="bg-gray-900 text-white"
                className="mt-1 block px-3 py-2 rounded-md text-base font-medium text-white hover:text-gray-200 hover:bg-gray-700"
              >
                Purchases
              </Link>
              <Link
                to="/Report"
                activeClassName="bg-gray-900 text-white"
                className="mt-1 block px-3 py-2 rounded-md text-base font-medium text-white hover:text-gray-200 hover:bg-gray-700"
              >
                Report
              </Link> */}
              <button
                onClick={handleLogout}
                className="mt-1 block px-3 py-2 rounded-md text-base font-medium text-white hover:text-gray-200 hover:bg-gray-700"
              >
                Logout
              </button>
            </div>
          </div>
        </nav>
      );
    }
  }
}
export default Navbar;
