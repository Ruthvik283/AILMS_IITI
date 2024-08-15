import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import AuthContext from "../context/AuthContext";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import Footer2 from "../components/Footer";
import {Link} from "react-router-dom"

const UserList = () => {
  const contextData = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [editUser, setEditUser] = useState(null);
  const [formData, setFormData] = useState({
    id: null,
    username: "",
    email: "",
    department: "",
    role: "",
  });
  const [selectedRole, setSelectedRole] = useState('All');

  const roles = ['All', 'Manager', 'Engineer'];
  const handleRoleChange = (role) => {
    setSelectedRole(role);
    if (role === 'All') {
      setFilteredUsers(users);
    } else {
      setFilteredUsers(users.filter(user => user.role_name == role));
    }
    // console.log(users);
  };

  useEffect(() => {
    document.title = "Users- AILMS";
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const tokenString = localStorage.getItem('authTokens');
    const token = tokenString ? JSON.parse(tokenString).access : null;

    const headers = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    axios
      .get("/api/get_users/",{ headers })
      .then((response) => {
        setUsers(response.data);
        setFilteredUsers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, []);

  const handleEdit = (user) => {
    setEditUser(user);
    setFormData(user);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.email.endsWith("@iiti.ac.in")) {
      toast.error(
        "Invalid email format. Please assign an email ending with @iiti.ac.in."
      );
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
    axios
      .post("/api/update_user/", formData, { headers })
      .then((response) => {
        toast.success("User updated successfully!");
        // Reset state and fetch updated user data
        setEditUser(null);
        setFormData({
          id: null,
          username: "",
          email: "",
          department: "",
          role: "",
        });
        setUsers([]);
        axios
          .get("/api/get_users/",{headers})
          .then((response) => {
            setUsers(response.data);
            //handleRoleChange code
            if (selectedRole === 'All') {
              setFilteredUsers(response.data);
            } else {
              setFilteredUsers((response.data).filter(user => user.role_name == selectedRole));
            }
          })
          .catch((error) => {
            console.error("Error fetching user data:", error);
          });
      })
      .catch((error) => {
        toast.error("Error updating user");
      });
  };


  return (
    <>
      <Navbar />
      <div className="container mx-auto py-8 min-h-screen">
       
        <h1 className="text-2xl font-semibold leading-tight px-10">Users</h1>
        <div className="bg-white shadow-md rounded-lg px-8 py-6 mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
              <div className="w-full sm:w-auto">
                <label htmlFor="role-filter" className="block text-sm font-medium text-gray-700 mb-2">Filter by role:</label>
                <select
                  id="role-filter"
                  value={selectedRole}
                  onChange={(e) => handleRoleChange(e.target.value)}
                  className="block w-full sm:w-auto bg-white border border-gray-300 rounded-md py-2 px-3 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {roles.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-wrap justify-center sm:justify-end space-x-0 sm:space-x-4 space-y-2 sm:space-y-0">
                <a 
                  href="/register_requests" 
                  className="w-full sm:w-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                  Register Requests
                </a>
                <a 
                  href="/technicians" 
                  className="w-full sm:w-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                  Technicians
                </a>
              </div>
            </div>
          </div>

      {/* <div class="flex justify-end">
  <a href="/register_requests" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 m-2 mt-1 rounded">Register Requests</a>
  <a href="/technicians" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 m-2 mt-1 rounded">Technicians</a>
</div> */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
            >
              {editUser && editUser.id === user.id ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input type="hidden" name="id" value={formData.id} />
                  <div>
                    <label
                      htmlFor="username"
                      className="block text-gray-700 font-semibold"
                    >
                      Username
                    </label>
                    <input
                      type="text"
                      name="username"
                      id="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className="form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-gray-700 font-semibold"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="department"
                      className="block text-gray-700 font-semibold"
                    >
                      Department
                    </label>
                    <select
                      id="department"
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    >
                      <option value="">Select a department</option>
                      {contextData.departmentData.map((department) => (
                        <option
                          key={department.department_id}
                          value={department.department_id}
                        >
                          {department.department_name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="role"
                      className="block text-gray-700 font-semibold"
                    >
                      Role
                    </label>
                    <select
                      name="role"
                      id="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      className="form-select mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      required
                    >
                      <option value="">Select Role</option>
                      {contextData.rolesData.map((role) => (
                        <option key={role.id} value={role.id}>
                          {role.role_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditUser(null)}
                      className="ml-2 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-2">
                  <h2 className="text-xl font-bold mb-2">{user.username}</h2>
                  <p className="text-gray-700">Email: {user.email}</p>
                  <p className="text-gray-700">
                    Department: {user.department_name}
                  </p>
                  <p className="text-gray-700">
                    Role: {user.role_name || "Not specified"}
                  </p>
                  <button
                    onClick={() => handleEdit(user)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300"
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <Footer2></Footer2>
    </>
  );
};

export default UserList;
