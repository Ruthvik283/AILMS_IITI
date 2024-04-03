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
      // const req=editedRequest;
      // if(req.department==="")req.department=null;
      // if(req.role==="")req.role=null;

      //   console.log("rr", req);
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
    if (!request.department) {
      toast.error("Please select a role for the user");
      return;
    }
    try {
      // Wait until signupUser function is completed
      await signupUser(request);

      // Once signupUser function is completed, fetch register requests
      fetchRegisterRequests();
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred while signing up the user");
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditedRequest({ ...editedRequest, [name]: value });
  };

  const getDepartmentNameById = (id) => {
    const department = contextData.departmentData.find(
      (department) => department.id === id
    );
    // console.log(contextData.rolesData);
    return department ? department.department_name : "NULL";
  };
  const getRoleNameById = (id) => {
    const role = contextData.rolesData.find((role) => role.id === id);
    return role ? role.role_name : "NULL";
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">Register Requests</h1>
      <table className="w-full table-auto">
        <thead>
          <tr>
            <th className="px-4 py-2">Username</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Department</th>
            <th className="px-4 py-2">Role</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {registerRequests.map((request) => (
            <tr key={request.id}>
              <td className="border px-4 py-2">
                {editingRequestId === request.id ? (
                  <input
                    type="text"
                    name="username"
                    value={editedRequest.username}
                    onChange={handleInputChange}
                    className="w-full px-2 py-1 border rounded"
                  />
                ) : (
                  request.username
                )}
              </td>
              <td className="border px-4 py-2">
                {editingRequestId === request.id ? (
                  <input
                    type="email"
                    name="email"
                    value={editedRequest.email}
                    onChange={handleInputChange}
                    className="w-full px-2 py-1 border rounded"
                  />
                ) : (
                  request.email
                )}
              </td>
              <td className="border px-4 py-2">
                {editingRequestId === request.id ? (
                  <select
                    id="department"
                    name="department"
                    value={editedRequest.department}
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
                ) : (
                  getDepartmentNameById(request.department)
                )}
              </td>
              <td className="border px-4 py-2">
                {editingRequestId === request.id ? (
                  <select
                    name="role"
                    id="role"
                    value={editedRequest.role}
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
                ) : (
                  getRoleNameById(request.role)
                )}
              </td>
              <td className="border px-4 py-2">
                {editingRequestId === request.id ? (
                  <div className="flex justify-center">
                    <button
                      onClick={handleUpdateRequest}
                      className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingRequestId(null)}
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex justify-center">
                    <button
                      onClick={() => handleEditRequest(request.id)}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mr-2 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleApproveRequest(request.id)}
                      className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 mr-2 rounded"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleDeleteRequest(request.id)}
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RegisterRequestList;
