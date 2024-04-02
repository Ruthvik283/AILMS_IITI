// import React, { useContext, useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import Footer2 from "../components/Footer";
// import Navbar from "../components/Navbar";
// import AuthContext from "../context/AuthContext";

// const DepartmentCard = ({ department }) => {
//   const { department_name, is_main, sub_departments, users } = department;
//   const [openDropdown, setOpenDropdown] = useState(false);

//   const toggleDropdown = () => {
//     setOpenDropdown(!openDropdown);
//   };

//   const handleOutsideClick = (e) => {
//     if (e.target.closest(".department-card") === null) {
//       setOpenDropdown(false);
//     }
//   };

//   useEffect(() => {
//     document.addEventListener("click", handleOutsideClick);
//     return () => {
//       document.removeEventListener("click", handleOutsideClick);
//     };
//   }, []);

//   return (
//     <div className="border border-gray-200 rounded-lg p-4 m-4 department-card">
//       <div className="flex items-center justify-between">
//         <h2 className="text-lg font-semibold">{department_name}</h2>
//         {is_main && (
//           <span className="text-[#52ab98] font-semibold">Main Department</span>
//         )}
//         <span
//           className={`${
//             openDropdown ? "rotate-180" : ""
//           } transition-transform cursor-pointer`}
//           onClick={toggleDropdown}
//         >
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             className="h-6 w-6"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M19 9l-7 7-7-7"
//             />
//           </svg>
//         </span>
//       </div>
//       {openDropdown && (
//         <div className="mt-4">
//           {sub_departments.length > 0 ? (
//             <div>
//               <h3 className="text-gray-600 text-sm font-semibold">
//                 Sub-departments:
//               </h3>
//               <ul className="list-disc ml-6">
//                 {sub_departments.map((subDept) => (
//                   <li key={subDept.id}>{subDept.department_name}</li>
//                 ))}
//               </ul>
//             </div>
//           ) : (
//             <h4 className="text-gray-500">No Sub-departments</h4>
//           )}

//           {users.length > 0 && (
//             <div className="mt-4">
//               <h3 className="text-gray-600 text-sm font-semibold">Users:</h3>
//               <ul className="ml-4">
//                 {users.map((user) => (
//                   <li key={user.id}>
//                     <h1>{user.role_name}</h1>
//                     <span className="font-semibold">
//                       {user.username}
//                     </span> - {user.email}
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default function Departments() {
//   const navigate = useNavigate();
//   const contextData = useContext(AuthContext);
//   const [departmentData, setDepartmentData] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch("http://127.0.0.1:8000/api/departments", {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//           },
//         });
//         if (!response.ok) {
//           throw new Error(`HTTP error! Status: ${response.status}`);
//         }
//         const data = await response.json();
//         setDepartmentData(data);
//         //console.log("fetched_department_data", data);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };
//     fetchData();
//   }, []);

//   return (
//     <>
//       <div className="min-h-screen">
//         <Navbar />
//         <div className="container mx-auto px-4 py-8">
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//             {departmentData.map((department) => (
//               <DepartmentCard
//                 key={department.department_id}
//                 department={department}
//               />
//             ))}
//           </div>
//         </div>
//       </div>
//       <Footer2 />
//     </>
//   );
// }

import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer2 from "../components/Footer";
import Navbar from "../components/Navbar";
import AuthContext from "../context/AuthContext";

const PopupCard = ({ department, onClose, handleSubDepartmentClick }) => {
  const { department_name, is_main, sub_departments = [], users } = department;

  const handleClick = (subDepartment) => {
    if (
      subDepartment.sub_departments &&
      subDepartment.sub_departments.length > 0
    ) {
      handleSubDepartmentClick(subDepartment);
    } else {
      onClose();
      handleSubDepartmentClick(subDepartment);
    }
    //handleSubDepartmentClick(subDepartment);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className=" bg-white rounded-lg p-6 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">{department_name}</h2>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        {is_main && (
          <span className="text-[#52ab98] font-semibold mt-2">
            Main Department
          </span>
        )}
        {sub_departments && sub_departments.length > 0 ? (
          <div className="mt-4">
            <h3 className="text-[#52ab98] text-sm font-semibold">
              Sub-departments:
            </h3>
            <ul className="list-disc ml-6">
              {sub_departments.map((subDept) => (
                <li
                  key={subDept.id}
                  onClick={() => handleClick(subDept)}
                  className="cursor-pointer hover:text-[#52ab98]"
                >
                  {subDept.department_name}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="mt-4">
            <h3 className="text-[#52ab98] text-sm font-semibold">
              Sub-departments:
            </h3>
            <p>No Sub-department</p>
          </div>
        )}
        {users && users.length > 0 && (
          <div className="mt-4">
            <h3 className="text-[#52ab98] text-sm font-semibold">Users:</h3>
            <ul className="ml-4">
              {users.map((user) => (
                <li key={user.id}>
                  <h1>{user.role_name}</h1>
                  <span className="font-semibold">{user.username}</span> -{" "}
                  {user.email}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

const DepartmentCard = ({ department, onClick }) => {
  const { department_name, is_main } = department;

  return (
    <div
      className="border border-gray-200 rounded-lg p-8 m-4 department-card shadow-lg transition-all duration-300 hover:shadow-xl cursor-pointer"
      onClick={onClick}
    >
      <div className="flex flex-col items-start justify-between h-full">
        <h2 className="text-lg font-semibold">{department_name}</h2>
        {is_main && (
          <span className="text-[#52ab98] font-semibold mt-2">
            Main Department
          </span>
        )}
      </div>
    </div>
  );
};

export default function Departments() {
  const navigate = useNavigate();
  const contextData = useContext(AuthContext);
  const [departmentData, setDepartmentData] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedSubDepartment, setSelectedSubDepartment] = useState(null);

  const backgroundImages = {
    CSE: "https://example.com/cse.jpg",
    MEMS: "https://example.com/mems.jpg",
    CIVIL: "https://example.com/civil.jpg",
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/departments", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setDepartmentData(data.filter((dept) => dept.is_main));
        //console.log("fetched_department_data", data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleCardClick = (department) => {
    setSelectedDepartment(department);
  };

  const handleClosePopup = () => {
    setSelectedDepartment(null);
    setSelectedSubDepartment(null);
  };

  const handleSubDepartmentClick = (subDepartment) => {
    setSelectedSubDepartment(subDepartment);
  };

  return (
    <>
      <div className="min-h-screen bg-[#FFFEFA]">
        <Navbar />
        <div className="container mx-auto px-4 py-8 flex justify-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {departmentData.map((department) =>
              department.is_main ? (
                <DepartmentCard
                  key={department.department_id}
                  department={department}
                  onClick={() => handleCardClick(department)}
                  backgroundImage={backgroundImages[department.department_name]}
                />
              ) : null
            )}
          </div>
        </div>
      </div>
      {selectedDepartment && (
        <PopupCard
          department={selectedDepartment}
          onClose={handleClosePopup}
          handleSubDepartmentClick={handleSubDepartmentClick}
        />
      )}
      {selectedSubDepartment && (
        <PopupCard
          department={selectedSubDepartment}
          onClose={handleClosePopup}
          handleSubDepartmentClick={handleSubDepartmentClick}
        />
      )}
      <Footer2 />
    </>
  );
}
