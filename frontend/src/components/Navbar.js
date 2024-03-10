// import React from 'react'

// export default function Navbar() {
  
  //     return (
    //         <>
    //             <div className=' h-3 bg-red-800'>hi</div>
    //         </>
    //     )
    // }
    // Navbar.js
    
    // import React, { useContext, useState, useEffect } from 'react'
    // import { Link } from 'react-router-dom';
    // import AuthContext from '../context/AuthContext'
    
    
    
    // const Navbar = () => {
      //     const contextData = useContext(AuthContext)
      //     const userData = contextData.userData
      //   return (
        //     <nav className="bg-gray-800 p-4">
        //       <div className="container mx-auto flex justify-between items-center">
        //         <div className="text-white text-xl font-bold">AILMS username: {userData.username}</div>
//         <div className="flex">
//           <NavLink to="/" activeClassName="text-yellow-400" className="text-white mr-4">Home</NavLink>
//           <NavLink to="/material" activeClassName="text-yellow-400" className="text-white mr-4">Materials</NavLink>
//           <NavLink to="/sanction" activeClassName="text-yellow-400" className="text-white mr-4">Sanctions</NavLink>
//           <NavLink to="/purchase" activeClassName="text-yellow-400" className="text-white">Purchases</NavLink>
//         </div>
//       </div>
//     </nav>
//   );
// };

// const NavLink = ({ to, children, ...rest }) => {
  //   return (
    //     <Link to={to} {...rest}>{children}</Link>
    //   );
    // };
    
    // export default Navbar;
    
    "use client";
    import React, { useState } from "react";
    import { Link } from 'react-router-dom'

// const people = ["Home", "Materials", "Sanctions", "Purchases"];

// const listItems = people.map((person) => (
//   <li className="px-3 py-2 cursor-pointer rounded hover:bg-sky-100">
//     {person}
//   </li>
// ));
function Navbar() {
  
  const [isOpen, setIsOpen] = useState(false);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };
  return (
<div className="w-full container relative p-3 flex justify-between items-center bg-[#00203FFF]">
  <h1 className="font-xl font-bold text-white pl-5">AILMS</h1>
  <nav className={isOpen ? "flex" : "hidden md:flex"}>
    <div className="flex bg-[#00203FFF] absolute md:relative flex-col md:flex-row w-full shadow md:shadow-none text-center top-12 left-0 md:top-0 md:flex">
      <Link to="/" activeClassName="text-yellow-400" className="px-3 py-2 cursor-pointer rounded hover:bg-sky-100 text-white bg-inherit">Home</Link>
      <Link to="/material" activeClassName="text-yellow-400" className="px-3 py-2 cursor-pointer rounded hover:bg-sky-100 text-white bg-inherit">Materials</Link>
      <Link to="/sanction" activeClassName="text-yellow-400" className="px-3 py-2 cursor-pointer rounded hover:bg-sky-100 text-white bg-inherit">Sanctions</Link>
      <Link to="/purchase" activeClassName="text-yellow-400" className="px-3 py-2 cursor-pointer rounded hover:bg-sky-100 text-white bg-inherit">Purchases</Link>
    </div>
  </nav>
  <div className="md:hidden bg-[#00203FFF]">
    <button className="flex justify-center items-center" onClick={toggleNavbar}>
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