import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer2 from "../components/Footer";
import Navbar from "../components/Navbar";
import AuthContext from "../context/AuthContext";
import { TbH1 } from "react-icons/tb";

const DepartmentCard = ({ department, onClick }) => {
  const { department_name, is_main, sub_departments, users } = department;

  return (
    <div className="border border-gray-200 rounded-lg p-4 m-4 cursor-pointer">
      <h2 className="text-lg font-semibold">{department_name}</h2>
      {is_main && (
        <>
          <h1 className=" text-pretty">Main Department</h1>
          {sub_departments.length > 0 ? (
            <div className="mt-2">
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
            <h1>No Sub-departments</h1>
          )}
        </>
      )}

      {users.length > 0 && (
        <div className="mt-4">
          <h3 className="text-gray-600 text-sm font-semibold">Users:</h3>
          <ul className="ml-4">
            {users.map((user) => (
              <li key={user.id}>
                <span className="font-semibold">{user.username}</span> -{" "}
                {user.email}
              </li>
            ))}
          </ul>
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
