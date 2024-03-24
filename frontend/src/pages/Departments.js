import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer2 from "../components/Footer";
import Navbar from "../components/Navbar";
import AuthContext from "../context/AuthContext";

const DepartmentCard = ({ department }) => {
  const { department_name, is_main, sub_departments, users } = department;
  const [openDropdown, setOpenDropdown] = useState(false);

  const toggleDropdown = () => {
    setOpenDropdown(!openDropdown);
  };

  const handleOutsideClick = (e) => {
    if (e.target.closest(".department-card") === null) {
      setOpenDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  return (
    <div className="border border-gray-200 rounded-lg p-4 m-4 department-card">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{department_name}</h2>
        {is_main && (
          <span className="text-green-500 font-semibold">Main Department</span>
        )}
        <span
          className={`${
            openDropdown ? "rotate-180" : ""
          } transition-transform cursor-pointer`}
          onClick={toggleDropdown}
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
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </span>
      </div>
      {openDropdown && (
        <div className="mt-4">
          {sub_departments.length > 0 ? (
            <div>
              <h3 className="text-gray-600 text-sm font-semibold">
                Sub-departments:
              </h3>
              <ul className="list-disc ml-6">
                {sub_departments.map((subDept) => (
                  <li key={subDept.id}>{subDept.department_name}</li>
                ))}
              </ul>
            </div>
          ) : (
            <h4 className="text-gray-500">No Sub-departments</h4>
          )}

          {users.length > 0 && (
            <div className="mt-4">
              <h3 className="text-gray-600 text-sm font-semibold">Users:</h3>
              <ul className="ml-4">
                {users.map((user) => (
                  <li key={user.id}>
                    <h1>{user.role_name}</h1>
                    <span className="font-semibold">
                      {user.username}
                    </span> - {user.email}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default function Departments() {
  const navigate = useNavigate();
  const contextData = useContext(AuthContext);
  const [departmentData, setDepartmentData] = useState([]);

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
        setDepartmentData(data);
        console.log("fetched_department_data", data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {departmentData.map((department) => (
              <DepartmentCard
                key={department.department_id}
                department={department}
              />
            ))}
          </div>
        </div>
      </div>
      <Footer2 />
    </>
  );
}
