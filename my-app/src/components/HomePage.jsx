// homepage.jsx

// import React from 'react';
// import { Link } from 'react-router-dom';

// const Homepage = () => {
//   return (
//     <div>

//       {/* <p> Hello</p>
//       Navbar */}
//       <nav className="flex flex-col md:flex-row justify-between p-4 bg-gray-200">
//         {/* Logo */}
//         <div className="mb-4 md:mb-0 md:mr-4">
//           <img src="IITI.png" alt="IIT Indore Logo" className="h-16 mt-2"/>
//         </div>
//         {/* Profile Button */}
//         <div className="text-center md:text-right">
//           <button className="bg-blue-500 text-white px-7 py-3 rounded-lg" onClick={() => console.log('Profile button clicked')}>
//             {/* Profile */}
//           </button>
//         </div>
//       </nav>

//       {/* Main Content */}
//       <div className="flex flex-col items-center justify-center h-screen">
//         <div className="flex">
//           {/* First Card */}
//           <div className="flex-1 overflow-hidden rounded bg-white text-slate-500 shadow-md shadow-slate-200 m-4 max-w-md w-full h-96">
//             <Link to="sanction-details" >
//               <div className="p-6">
//                 <h3 className="mb-4 text-xl font-medium text-slate-700">
//                   Current Sanctions
//                 </h3>
//                 <p>
//                   All components can be copied and pasted and easily implemented in
//                   your Tailwind CSS projects. You can choose which language you want
//                   to copy the desired component and just hover and click on the
//                   component you need and paste it into your project.
//                 </p>
//               </div>
//               </Link>
//           </div>
      
//   {/* Second Card */}
//   <div className="flex-1 overflow-hidden rounded bg-white text-slate-500 shadow-md shadow-slate-200 m-4 max-w-md w-full h-96">
//             <Link to="/sanction-details" >
//               <div className="p-6">
//                 <h3 className="mb-4 text-xl font-medium text-slate-700">
//                   Sanctions History
//                 </h3>
//                 <p>
//                   All components can be copied and pasted and easily implemented in
//                   your Tailwind CSS projects. You can choose which language you want
//                   to copy the desired component and just hover and click on the
//                   component you need and paste it into your project.
//                 </p>
//               </div>
//               </Link>
//           </div>
//         </div>

//         {/* Footer */}
//         <footer className="p-4 bg-gray-200 w-full text-center">
//           &copy; 2024 Your Company Name. All rights reserved.
//         </footer>
//       </div>
//     </div>
//   );
// }

// export default Homepage;

import React from 'react';
import { Link } from 'react-router-dom';

const Homepage = () => {
  return (
    <div>
      {/* Navbar */}
      <nav className="flex flex-col md:flex-row justify-between p-4 bg-gray-200 px-8">
        {/* Logo */}
        <div className="mb-4 md:mb-0 md:mr-4">
          <img src="IITI.png" alt="IIT Indore Logo" className="h-24 mt-2" />
          </div>
          <div  className="text-2xl font-serif font-bold p-2 mr-auto mt-14">Asset, Inventory And Logistics Management System</div>
        {/* Profile Buttons */}
        <div className="text-center md:text-right">
          <Link to="/login">
            <button className="bg-blue-500 text-white px-7 py-3 rounded-lg">
              Profile
            </button>
          </Link> 
        </div>
      </nav>

      {/* Main Content */}
      < div className="flex flex-col items-center justify-center h-screen mt-8">
        <div className="flex">
          {/* First Card */}
          <div className="flex-1 overflow-hidden rounded bg-white text-slate-500 shadow-md shadow-slate-200 m-1 max-w-md w-full h-80">
            <Link to="/sanction-details">
              <div className="p-6">
                <h3 className="mb-4 text-xl font-medium text-slate-700">
                 <b> Current Sanctions</b>
                </h3>
                <p>
                  All components can be copied and pasted and easily implemented in
                  your Tailwind CSS projects. You can choose which language you want
                  to copy the desired component and just hover and click on the
                  component you need and paste it into your project.
                </p>
              </div>
            </Link>
          </div>
      
          {/* Second Card */}
          <div className="flex-1 overflow-hidden rounded bg-white text-slate-500 shadow-md shadow-slate-200 m-1 max-w-md w-full h-80">
            <Link to="/sanction-history">
              <div className="p-6">
                <h3 className="mb-4 text-xl font-medium text-slate-700">
                 <b> Sanctions History</b>
                </h3>
                <p>
                  All components can be copied and pasted and easily implemented in
                  your Tailwind CSS projects. You can choose which language you want
                  to copy the desired component and just hover and click on the
                  component you need and paste it into your project.
                </p>
              </div>
            </Link>
          </div>
        </div>

       
  
    <>
      {/* Footer */}
<footer className="w-full text-slate-500 mt-2">
  {/* Main footer */}
  <div className="pt-16 pb-12 text-sm border-t border-slate-200 bg-slate-100 mt-4">
    <div className="container px-6 mx-auto">
      <div className="grid grid-cols-4 gap-6 md:grid-cols-8 lg:grid-cols-12">
        <nav
          className="col-span-2 md:col-span-4 lg:col-span-4"
          aria-labelledby="footer-product-3"
        >
          <h3
            className="mb-3 text-base font-medium text-slate-700 mt-2"
            id="footer-product-3"
          >
            Product
          </h3>
          <ul>
            <li className="mb-2 leading-6">
              <a
                href="javascript:void(0)"
                className="transition-colors duration-300 hover:text-emerald-500 focus:text-emerald-600"
              >
                Customers
              </a>
            </li>
          </ul>
        </nav>
        <nav
          className="col-span-2 md:col-span-4 lg:col-span-4"
          aria-labelledby="footer-about-3"
        >
          <h3
            className="mb-3 text-base font-medium text-slate-700 mt-0"
            id="footer-about-3"
          >
            About us
          </h3>
          <ul>
            <li className="mb-1 leading-6">
              <a
                href="javascript:void(0)"
                className="transition-colors duration-300 hover:text-emerald-500 focus:text-emerald-600"
              >
                About us
              </a>
            </li>
            <li className="mb- leading-6">
              <a
                href="javascript:void(0)"
                className="transition-colors duration-300 hover:text-emerald-500 focus:text-emerald-600"
              >
                Events
              </a>
            </li>
          </ul>
        </nav>
        <nav
          className="col-span-2 md:col-span-4 lg:col-span-4"
          aria-labelledby="footer-get-in-touch-3"
        >
          <h3
            className="mb-3 text-base font-medium text-slate-700 mt-2"
            id="footer-get-in-touch-3"
          >
            Get in touch
          </h3>
          <ul>
            <li className="mb-1 leading-6">
              <a
                href="javascript:void(0)"
                className="transition-colors duration-300 hover:text-emerald-500 focus:text-emerald-600"
              >
                Contact
              </a>
            </li>
            <li className="mb-2 leading-6">
              <a
                href="javascript:void(0)"
                className="transition-colors duration-300 hover:text-emerald-500 focus:text-emerald-600"
              >
                Support
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </div>
</footer>
      </>


      </div>
    </div>
  );
}

export default Homepage;
