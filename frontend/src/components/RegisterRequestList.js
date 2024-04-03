import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import AuthContext from "../context/AuthContext";
import toast from "react-hot-toast";

const RegisterRequestList = () => {
  const [registerRequests, setRegisterRequests] = useState([]);
  const [editingRequestId, setEditingRequestId] = useState(null);
  const [editedRequest, setEditedRequest] = useState({});
  const contextData = useContext(AuthContext);

  useEffect(() => {
    fetchRegisterRequests();
  }, []);

  const fetchRegisterRequests = async () => {
    try {
      const response = await axios.get("/api/register_requests/");
      setRegisterRequests(response.data);
      //setEditedRequest(response.data);
    } catch (error) {
      console.error("Error fetching register requests:", error);
    }
  };

  const handleEditRequest = (requestId) => {
    setEditingRequestId(requestId);
    const request = registerRequests.find((req) => req.id === requestId);
    setEditedRequest(request);
  };

  const handleUpdateRequest = async () => {
    try {
      await axios.post("/api/edit_register_request/", editedRequest);
      setEditingRequestId(null);
      toast.success("Register-request updated successfully!");
      fetchRegisterRequests();
    } catch (error) {
      console.error("Error updating register request:", error);
    }
  };
  const handleDeleteRequest = async (id) => {
    try {
      await axios.post(`/api/delete_register_request/${id}`, editedRequest);
      setEditingRequestId(null);
      toast.success("Register-request deleted successfully!");
      fetchRegisterRequests();
    } catch (error) {
      console.error("Error deleting register request:", error);
    }
  };
  let { signupUser } = useContext(AuthContext);
  const handleApproveRequest = async (id) => {
    const request = registerRequests.find((req) => req.id === id);
    if (!request.role) {
      toast.error("Please select a role for the user");
      return;
    }
    signupUser(request);
    fetchRegisterRequests();
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditedRequest({ ...editedRequest, [name]: value });
  };

  const getDepartmentNameById = (id) => {
    const department = contextData.departmentData.find(
      (department) => department.id === id
    );
    console.log(contextData.rolesData);
    return department ? department.department_name : "Unknown";
  };
  const getRoleNameById = (id) => {
    const role = contextData.rolesData.find((role) => role.id === id);
    return role ? role.role_name : "NULL";
  };


  return (
    <div className="bg-[#FFFEFA] min-h-screen py-8">
    <div className="container mx-auto px-4 sm:px-8">
    <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
      <div className="py-4">
        <h2 className="text-2xl font-semibold leading-tight">Register Requests</h2>
      </div>
      <div className="inline-block min-w-full shadow overflow-hidden">
        <table className="min-w-full leading-normal bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Username
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Email
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Department
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Role
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {registerRequests.map((request) => (
              <tr key={request.id} >
                <td className="px-5 py-4 border-b border-gray-200 text-sm">
                  {editingRequestId === request.id ? (
                    <input
                      type="text"
                      name="username"
                      value={editedRequest.username}
                      onChange={handleInputChange}
                      className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    request.username
                  )}
                </td>
                <td className="px-5 py-4 border-b border-gray-200 text-sm">
                  {editingRequestId === request.id ? (
                    <input
                      type="email"
                      name="email"
                      value={editedRequest.email}
                      onChange={handleInputChange}
                      className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    request.email
                  )}
                </td>
                <td className="px-5 py-4 border-b border-gray-200 text-sm">
                  {editingRequestId === request.id ? (
                    <select
                      id="department"
                      name="department"
                      value={editedRequest.department}
                      onChange={handleInputChange}
                      className="w-full rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  ) : (
                    getDepartmentNameById(request.department)
                  )}
                </td>
                <td className="px-5 py-4 border-b border-gray-200 text-sm">
                  {editingRequestId === request.id ? (
                    <select
                      name="role"
                      id="role"
                      value={editedRequest.role}
                      onChange={handleInputChange}
                      className="form-select mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select Role</option>
                      {contextData.rolesData.map((role) => (
                        <option key={role.id} value={role.id}>
                          {role.role_name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    getRoleNameById(request.role)
                  )}
                </td>
                
                <td className="px-5 py-4 border-b border-gray-200 text-sm">
                  {editingRequestId === request.id ? (
                    <div className="flex justify-center">
                      <button
                        onClick={handleUpdateRequest}
                        className="relative inline-flex items-center px-4 py-2 font-semibold leading-tight text-white bg-green-500 rounded-full hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150"
                      >
                        <span className="relative">Save</span>
                      </button>
                      <button
                        onClick={() => setEditingRequestId(null)}
                        className="relative inline-flex items-center px-4 py-2 ml-2 font-semibold leading-tight text-white bg-red-500 rounded-full hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-150"
                      >
                        <span className="relative">Cancel</span>
                      </button>
                    </div>
                  ) : (
                    <div className="flex justify-center">
                      <button
                        onClick={() => handleEditRequest(request.id)}
                        className="relative inline-flex items-center px-4 py-2 font-semibold leading-tight text-white bg-blue-500 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150"
                      >
                        <span className="relative">Edit</span>
                      </button>
                      <button
                        onClick={() => handleApproveRequest(request.id)}
                        className="relative inline-flex items-center px-4 py-2 ml-2 font-semibold leading-tight text-white bg-green-500 rounded-full hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150"
                      >
                        <span className="relative">Approve</span>
                      </button>
                      <button
                        onClick={() => handleDeleteRequest(request.id)}
                        className="relative inline-flex items-center px-4 py-2 ml-2 font-semibold leading-tight text-white bg-red-500 rounded-full hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-150"
                      >
                        <span className="relative">Delete</span>
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </div>
    </div>
  );
};

export default RegisterRequestList;
