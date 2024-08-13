import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import Footer2 from "../components/Footer";

const EditDepartmentModal = ({
  editDepartment,
  handleEditDepartment,
  handleCancelEditDepartment,
  departments,
  setEditDepartment,
}) => {
  return (
    <div className="fixed z-10 inset-0 overflow-y-auto bg-gray-800 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 w-90">
        <h2 className="text-2xl font-bold mb-4">Edit Department</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleEditDepartment();
          }}
          className="space-y-4"
        >
          <div>
            <label htmlFor="department_name" className="block font-bold mb-2">
              Name
            </label>
            <input
              type="text"
              id="department_name"
              name="department_name"
              value={editDepartment.department_name}
              onChange={(e) =>
                setEditDepartment({
                  ...editDepartment,
                  department_name: e.target.value,
                })
              }
              className="border border-gray-400 p-2 w-full rounded-md focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={editDepartment.is_main}
                onChange={(e) =>
                  setEditDepartment({
                    ...editDepartment,
                    is_main: e.target.checked,
                  })
                }
                className="form-checkbox text-blue-500"
              />
              <span className="ml-2 text-gray-700">Main Department</span>
            </label>
          </div>
          {!editDepartment.is_main && (
            <div>
              <label htmlFor="parent_department" className="block font-bold mb-2">
                Parent Department
              </label>
              <select
                id="parent_department"
                name="parent_department"
                value={editDepartment.parent_department || ""}
                onChange={(e) =>
                  setEditDepartment({
                    ...editDepartment,
                    parent_department: e.target.value,
                  })
                }
                className="w-full border border-gray-400 p-2 rounded-md focus:outline-none focus:border-blue-500"
              >
                <option value="">Select Parent Department</option>
                {departments
                  .filter((dept) => dept.is_main)
                  .map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.department_name}
                    </option>
                  ))}
              </select>
            </div>
          )}
          <div className="flex justify-end">
            <button
              type="button"
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded mr-2 focus:outline-none focus:ring focus:ring-gray-400"
              onClick={handleCancelEditDepartment}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring focus:ring-blue-400"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AddDepartmentModal = ({
  handleAddDepartment,
  handleCancelAddDepartment,
  departments,
  setNewDepartment,
  newDepartment,
}) => {
  return (
    <div className="fixed z-10 inset-0 overflow-y-auto bg-gray-800 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 w-90">
        <h2 className="text-2xl font-bold mb-4">Add Department</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAddDepartment();
          }}
          className="space-y-4"
        >
          <div>
            <label htmlFor="department_name" className="block font-bold mb-2">
              Name
            </label>
            <input
              type="text"
              id="department_name"
              name="department_name"
              value={newDepartment.department_name}
              onChange={(e) =>
                setNewDepartment({
                  ...newDepartment,
                  department_name: e.target.value,
                })
              }
              className="border border-gray-400 p-2 w-full rounded-md focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="is_main"
                checked={newDepartment.is_main}
                onChange={(e) =>
                  setNewDepartment({
                    ...newDepartment,
                    is_main: e.target.checked,
                  })
                }
                className="form-checkbox text-blue-500"
              />
              <span className="ml-2 text-gray-700">Main Department</span>
            </label>
          </div>
          {!newDepartment.is_main && (
            <div>
              <label htmlFor="parent_department" className="block font-bold mb-2">
                Parent Department
              </label>
              <select
                id="parent_department"
                name="parent_department"
                value={newDepartment.parent_department || ""}
                onChange={(e) =>
                  setNewDepartment({
                    ...newDepartment,
                    parent_department: e.target.value || null,
                  })
                }
                className="w-full border border-gray-400 p-2 rounded-md focus:outline-none focus:border-blue-500"
              >
                <option value="">Select Parent Department</option>
                {departments
                  .filter((dept) => dept.is_main)
                  .map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.department_name}
                    </option>
                  ))}
              </select>
            </div>
          )}
          <div className="flex justify-end">
            <button
              type="button"
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded mr-2 focus:outline-none focus:ring focus:ring-gray-400"
              onClick={handleCancelAddDepartment}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring focus:ring-blue-400"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const DepartmentsPage = () => {
  const [departments, setDepartments] = useState([]);
  const [newDepartment, setNewDepartment] = useState({
    department_name: "",
    is_main: false,
    parent_department: null,
  });
  const [editDepartment, setEditDepartment] = useState(null);
  const [showAddDepartmentModal, setShowAddDepartmentModal] = useState(false);

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    document.title = "Departments- AILMS";
    window.scrollTo(0, 0);
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await axios.get("/api/departments");
      setDepartments(response.data);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  const handleAddDepartment = async () => {
    try {
      if (newDepartment.department_name === "") {
        toast.error("Name can't be empty");
        return;
      }
      if (newDepartment.is_main === false && !newDepartment.parent_department) {
        toast.error("Parent department for non-main department can't be empty!");
        return;
      }
      const tokenString = localStorage.getItem('authTokens');
      const token = tokenString ? JSON.parse(tokenString).access : null;
  
      const headers = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      const response = await axios.post("/api/add_department/", newDepartment,{headers});
      if (response.status >= 200 && response.status < 300) {
        toast.success("Department added successfully");
        fetchDepartments();
        setShowAddDepartmentModal(false);
        setNewDepartment({
          department_name: "",
          is_main: false,
          parent_department: null,
        });
      } else {
        toast.error("Error adding department");
      }
    } catch (error) {
      console.error("Error adding department:", error);
      toast.error("Error adding department");
    }
  };

  const handleEditDepartment = async () => {
    try {
      if (editDepartment.department_name === "") {
        toast.error("Name can't be empty");
        return;
      }
      if (editDepartment.is_main === false && !editDepartment.parent_department) {
        toast.error("Parent department for non-main department can't be empty!");
        return;
      }
      const tokenString = localStorage.getItem('authTokens');
      const token = tokenString ? JSON.parse(tokenString).access : null;
  
      const headers = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      const response = await axios.post(
        "/api/edit_department/",
        JSON.stringify(editDepartment),
        {
          headers: headers,
        }
      );
      if (response.status >= 200 && response.status < 300) {
        toast.success("Department edited successfully");
        fetchDepartments();
      } else {
        toast.error("Error updating department");
      }
      setEditDepartment(null);
    } catch (error) {
      console.error("Error editing department:", error);
    }
  };

  const handleCancelEditDepartment = () => {
    setEditDepartment(null);
  };

  const handleCancelAddDepartment = () => {
    setShowAddDepartmentModal(false);
    setNewDepartment({
      department_name: "",
      is_main: false,
      parent_department: null,
    });
  };

  return (
    <div>
      <Navbar className="w-full" />
      <div className="py-4 min-h-screen bg-[#FFFEFA]">
        <div className="mt-4">
          <h2 className="text-2xl font-bold  px-12">Departments</h2>
          <div className="flex justify-end px-12 mb-4">
            <button
              onClick={() => setShowAddDepartmentModal(true)}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring focus:ring-blue-400"
            >
              Add Department
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-12">
          {departments.map((department) => (
            <div
              key={department.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
            >
              <div>
                <h3 className="text-xl font-semibold mb-2">{department.department_name}</h3>
                <p className="text-gray-600 mb-2">Main Department: {department.is_main ? "Yes" : "No"}</p>
                {department.parent_department && (
                  <p className="text-gray-600 mb-4">Parent Department: {department.parent_department_name}</p>
                )}
              </div>
              <div className="mt-4">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  onClick={() => setEditDepartment(department)}
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
        {/* <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4 px-10">Add Department</h2>
          <div className="flex justify-start px-12">
            <button
              onClick={() => setShowAddDepartmentModal(true)}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring focus:ring-blue-400"
            >
              Add Department
            </button>
          </div>
        </div> */}

        {editDepartment && (
          <EditDepartmentModal
            editDepartment={editDepartment}
            handleEditDepartment={handleEditDepartment}
            handleCancelEditDepartment={handleCancelEditDepartment}
            departments={departments}
            setEditDepartment={setEditDepartment}
          />
        )}

        {showAddDepartmentModal && (
          <AddDepartmentModal
            handleAddDepartment={handleAddDepartment}
            handleCancelAddDepartment={handleCancelAddDepartment}
            departments={departments}
            setNewDepartment={setNewDepartment}
            newDepartment={newDepartment}
          />
        )}
      </div>
      <Footer2></Footer2>
    </div>
  );
};

export default DepartmentsPage;