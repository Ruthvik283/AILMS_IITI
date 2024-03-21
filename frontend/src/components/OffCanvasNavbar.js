import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiUser } from "react-icons/fi";
import AuthContext from "../context/AuthContext";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { TbLogout2, TbLogin2 } from "react-icons/tb";
import { MdOutlineSportsCricket } from "react-icons/md";

export default function OffCanvasNavbar() {
  let { logoutUser } = useContext(AuthContext);
  const contextData = useContext(AuthContext);
  // console.log(contextData)

  function closeMenu() {
    const menu = document.getElementById("menu");
    menu.classList.remove("right-0");
    menu.classList.add("-right-full");
    // console
  }

  return (
    <>
      <div
        id="menu"
        className="z-50 top-0 bg-slate-800 fixed sm:w-[40%] md:w-[35%] lg:w-1/4 w-screen justify-around sm:h-screen -right-full Transition"
      >
        <section>
          <button
            className="md:w-12 w-10 pt-2 pl-2"
            id="close-button"
            onClick={closeMenu}
          >
            <img src="/images/close.png" alt="close button" />
          </button>
        </section>

        <div className="px-8 py-2 xl:text-xl">
          <span className="text-white xl:text-2xl mt-2">
            Hi, {contextData.userData.username}
          </span>

          <Link
            to="/profile"
            className={contextData.user != null ? `block` : `hidden`}
          >
            <div
              className="grid grid-cols-3 border-0 py-2 mt-8 md:mt-14 px-2 mx-[10%] sm:mx-0 btn
                        bg-slate-300 rounded-md hover:bg-slate-100"
            >
              <FiUser className="h-6 w-6 lg:h-10 lg:w-10 icon" />
              <div className="flex justify-center my-auto hover:border-orange-400">
                Profile
              </div>
            </div>
          </Link>

          <Link
            to="/orders"
            className={contextData.user != null ? `block` : `hidden`}
          >
            <div
              className="md:mb-[20%] grid grid-cols-3 py-2 mt-6 text-center whitespace-nowrap px-2 mx-[10%] sm:mx-0 btn
                        bg-slate-300 rounded-md hover:bg-slate-100"
            >
              <AiOutlineShoppingCart className="h-6 w-6 lg:h-10 lg:w-10 icon" />
              <div className="flex my-auto col-span-2 pr-[5%]">Your Orders</div>
            </div>
          </Link>

          <Link
            to="/login"
            className={contextData.user === null ? `block` : `hidden`}
          >
            <div
              className="grid grid-cols-3 border-0 py-2 mt-8 md:mt-14 px-2 mx-[10%] sm:mx-0 btn
                        bg-slate-300 rounded-md hover:bg-slate-100"
            >
              <TbLogin2 className="h-6 w-6 lg:h-10 lg:w-10 icon" />
              <div className="flex justify-center my-auto hover:border-orange-400">
                Login
              </div>
            </div>
          </Link>

          <Link to="/events">
            <div
              className="md:hidden grid grid-cols-3 py-2 mt-6 mb-[20%] md:mb-[0%] text-center px-2 mx-[10%] sm:mx-0 btn
                        bg-slate-300 rounded-md hover:bg-slate-100"
            >
              <MdOutlineSportsCricket className="h-6 w-6 lg:h-10 lg:w-10 icon" />
              <div className="flex justify-center my-auto hover:border-orange-400">
                Events
              </div>
            </div>
          </Link>

          <hr className={contextData.user != null ? `block` : `hidden`} />

          <div
            title="Sorry to see you go!"
            onClick={() => {
              logoutUser();
              closeMenu();
            }}
            className={
              contextData.user != null ? `block cursor-pointer` : `hidden`
            }
          >
            <div
              className="grid grid-cols-3 py-2 my-6 text-center px-2 mx-[10%] sm:mx-0 btn
                        bg-red-300 rounded-md hover:bg-orange-100"
            >
              <TbLogout2 className="h-6 w-6 lg:h-10 lg:w-10 icon" />
              <div className="flex border-0 justify-center my-auto">Logout</div>
            </div>
          </div>
        </div>
      </div>

      <style jsx="true">
        {`
          .Transition {
            transition-property: all;
            transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
            transition-duration: 650ms;
          }

          .icon {
            color: rgb(2, 66, 150);
          }

          .btn:hover {
            box-shadow: 0 0 0 5px rgb(251 146 60);
            transition: 0.3s;
          }

          @media screen and (max-width: 320px) #menu {
            width: 100vw;
          }
        `}
      </style>
    </>
  );
}
