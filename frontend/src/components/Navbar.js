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

  {
    if (userData.role == "Manager") {
        //This is manager's Navbar
        //In the else you can find engineer's Navbar
      return (
        <nav className="bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                {/* <h1 className="text-white font-bold text-xl">
                  AILMS: {userData.username}
                </h1> */}
                <div className="flex flex-shrink-0 items-center">
          <a href="/">
            <img className="h-8 w-auto" src={require("./AILMS.png")} alt="Your Company"/>
          </a>
        </div>
              </div>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  <Link
                    to="/"
                    activeClassName="text-white bg-gray-900 hover:bg-gray-700"
                    className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Home
                  </Link>
                  <Link
                    to="/material"
                    activeClassName="text-white bg-gray-900 hover:bg-gray-700"
                    className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    MaterialsTable
                  </Link>
                  <Link
                    to="/materials"
                    activeClassName="text-white bg-gray-900 hover:bg-gray-700"
                    className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Materials
                  </Link>
                  <Link
                    to="/sanction"
                    activeClassName="text-white bg-gray-900 hover:bg-gray-700"
                    className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Sanctions
                  </Link>
                  <Link
                    to="/purchase"
                    activeClassName="text-white bg-gray-900 hover:bg-gray-700"
                    className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Purchases
                  </Link>
                  <Link
                    to="/Report"
                    activeClassName="text-white bg-gray-900 hover:bg-gray-700"
                    className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Report
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Logout
                  </button>
                </div>
              </div>
              <div className="-mr-2 flex md:hidden">
                <button
                  onClick={toggleNavbar}
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:bg-gray-700 focus:text-white transition duration-150 ease-in-out"
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
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700"
              >
                Home
              </Link>
              <Link
                to="/material"
                activeClassName="bg-gray-900 text-white"
                className="mt-1 block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700"
              >
                MaterialsTable
              </Link>
              <Link
                to="/materials"
                activeClassName="bg-gray-900 text-white"
                className="mt-1 block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700"
              >
                Materials
              </Link>
              <Link
                to="/sanction"
                activeClassName="bg-gray-900 text-white"
                className="mt-1 block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700"
              >
                Sanctions
              </Link>
              <Link
                to="/purchase"
                activeClassName="bg-gray-900 text-white"
                className="mt-1 block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700"
              >
                Purchases
              </Link>
              <Link
                to="/Report"
                activeClassName="bg-gray-900 text-white"
                className="mt-1 block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700"
              >
                Report
              </Link>
              <button
                onClick={handleLogout}
                className="mt-1 block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700"
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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-white font-bold text-xl">
                  AILMS: {userData.username}
                </h1>
              </div>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  <Link
                    to="/"
                    activeClassName="text-white bg-gray-900 hover:bg-gray-700"
                    className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Home
                  </Link>
                  <Link
                    to="/material"
                    activeClassName="text-white bg-gray-900 hover:bg-gray-700"
                    className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    MaterialsTable
                  </Link>
                  <Link
                    to="/materials"
                    activeClassName="text-white bg-gray-900 hover:bg-gray-700"
                    className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Materials
                  </Link>
                  <Link
                    to="/sanction"
                    activeClassName="text-white bg-gray-900 hover:bg-gray-700"
                    className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Sanctions
                  </Link>
                  {/* <Link
                    to="/purchase"
                    activeClassName="text-white bg-gray-900 hover:bg-gray-700"
                    className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Purchases
                  </Link> */}
                  {/* <Link
                    to="/Report"
                    activeClassName="text-white bg-gray-900 hover:bg-gray-700"
                    className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Report
                  </Link> */}
                  <button
                    onClick={handleLogout}
                    className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Logout
                  </button>
                </div>
              </div>
              <div className="-mr-2 flex md:hidden">
                <button
                  onClick={toggleNavbar}
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:bg-gray-700 focus:text-white transition duration-150 ease-in-out"
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
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700"
              >
                Home
              </Link>
              <Link
                to="/material"
                activeClassName="bg-gray-900 text-white"
                className="mt-1 block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700"
              >
                MaterialsTable
              </Link>
              <Link
                to="/materials"
                activeClassName="bg-gray-900 text-white"
                className="mt-1 block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700"
              >
                Materials
              </Link>
              <Link
                to="/sanction"
                activeClassName="bg-gray-900 text-white"
                className="mt-1 block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700"
              >
                Sanctions
              </Link>
              {/* <Link
                to="/purchase"
                activeClassName="bg-gray-900 text-white"
                className="mt-1 block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700"
              >
                Purchases
              </Link>
              <Link
                to="/Report"
                activeClassName="bg-gray-900 text-white"
                className="mt-1 block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700"
              >
                Report
              </Link> */}
              <button
                onClick={handleLogout}
                className="mt-1 block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700"
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
//previous navbar code
/*"use client";
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

*/
