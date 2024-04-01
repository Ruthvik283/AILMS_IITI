import React from "react";
import { Link } from "react-router-dom";

export default function Navbar2() {
  function displayMenu() {
    const menu = document.getElementById("menu");
    menu.classList.add("right-0");
    menu.classList.remove("-right-full");
  }
  return (
    <>
      <div className="bg-[#1C2434] sticky top-0 z-10 flex justify-between px-[8%]">
        <div className="border-0 my-auto md:ml-5 items-center">
          <Link to="/">
            <h1 className="text-white">AILMS</h1>
          </Link>
        </div>

        <div className="py-2 flex justify-between md:w-1/3 lg:text-xl">
          <div className="my-auto text-gray-300 hover:text-white hover:font-semibold Transition-logo hidden md:block">
            <Link to="/">Home</Link>
          </div>
          <div className="my-auto text-gray-300 hover:text-white hover:font-semibold Transition-logo hidden md:block">
            <Link to="/sanction">Sanctions</Link>
          </div>
          <div className="my-auto text-gray-300 hover:text-white hover:font-semibold Transition-logo hidden md:block">
            <Link to="/report">Report</Link>
          </div>
          <div className="my-auto md:pr-8">
            <button onClick={displayMenu} className="text-white">
              <img
                className="md:h-12 md:w-12 h-10 w-10 user text-white bg-white"
                src="/images/menu.png"
              />
            </button>
          </div>
        </div>
      </div>

      <style jsx="true">
        {`
          .user:hover {
            border-radius: 9999px;
            box-shadow: 0 0 0 5px rgba(251, 146, 60, 0.8);
            transition: 0.3s;
          }

          .Transition-logo {
            transition-property: all;
            transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
            transition-duration: 200ms;
          }

          .logo {
            height: 8vh;
          }
        `}
      </style>
    </>
  );
}
