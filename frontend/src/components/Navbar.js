// import React from 'react'
// import { Link } from 'react-router-dom'

// export default function Navbar() {

//     return (
//         <>
//             <div className=' h-3 bg-red-800'>hi</div>
//         </>
//     )
// }
// Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-xl font-bold">AILMS</div>
        <div className="flex">
            
          <NavLink to="/" activeClassName="text-yellow-400" className="text-white mr-4">Home</NavLink>
          <NavLink to="/material" activeClassName="text-yellow-400" className="text-white mr-4">Materials</NavLink>
          <NavLink to="/sanction" activeClassName="text-yellow-400" className="text-white mr-4">Sanctions</NavLink>
          <NavLink to="/purchase" activeClassName="text-yellow-400" className="text-white">Purchases</NavLink>
        </div>
      </div>
    </nav>
  );
};

const NavLink = ({ to, children, ...rest }) => {
  return (
    <Link to={to} {...rest}>{children}</Link>
  );
};

export default Navbar;
