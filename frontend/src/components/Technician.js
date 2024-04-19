
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import AuthContext from "../context/AuthContext";
import toast from "react-hot-toast";

const TechnicianTable = () => {
  const contextData = useContext(AuthContext);
  const [technicians, setTechnicians] = useState([]);
  const [editingTechnicianId, setEditingTechnicianId] = useState(null);
  const [editedTechnician, setEditedTechnician] = useState({});
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [technicianToDelete, setTechnicianToDelete] = useState(null);

  useEffect(() => {
    fetchTechnicians();
  }, []);

  const fetchTechnicians = async () => {
    try {
      const response = await axios.get(
        "/api/technicians/"
      );
      setTechnicians(response.data);
    } catch (error) {
      console.error("Error fetching technicians:", error);
    }
  };

  const handleEditTechnician = (technician) => {
    setEditingTechnicianId(technician.id);
    setEditedTechnician(technician);
  };

  const handleUpdateTechnician = async () => {
    try {
      await axios.put(
        `/api/edit_technician/${editedTechnician.id}/`,
        editedTechnician
      );
      setEditingTechnicianId(null);
      toast.success("Technician updated successfully!");
      fetchTechnicians();
    } catch (error) {
      console.error("Error updating technician:", error);
    }
  };

  const handleDeleteTechnician = (technician) => {
    setTechnicianToDelete(technician);
    setShowDeleteConfirmation(true);
  };

  const confirmDeleteTechnician = async () => {
    try {
      await axios.delete(
        `/api/delete_technician/${technicianToDelete.id}/delete/`
      );
      toast.success("Technician deleted successfully!");
      setShowDeleteConfirmation(false);
      fetchTechnicians();
    } catch (error) {
      console.error("Error deleting technician:", error);
      toast.success("Error deleting technician");
    }
  };

  const cancelDeleteTechnician = () => {
    setShowDeleteConfirmation(false);
    setTechnicianToDelete(null);
  };

  const getDepartmentNameById = (id) => {
    const department = contextData.departmentData.find(
      (department) => department.department_id === id
    );
    return department ? department.department_name : "Unknown";
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditedTechnician({ ...editedTechnician, [name]: value });
  };

  return (
    <div className="bg-[#FFFEFA] min-h-screen py-8">
      <div className="container mx-auto px-4 sm:px-8">
        <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
          <div className="py-4 flex justify-between items-center">
            <h2 className="text-2xl font-semibold leading-tight">Technicians</h2>
            <button
              onClick={() => setEditingTechnicianId(-1)}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
              Add Technician
            </button>
          </div>
          <div className="inline-block min-w-full shadow overflow-hidden">
            <table className="min-w-full leading-normal bg-white">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Technician ID
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {technicians.map((technician) => (
                  <tr key={technician.id}>
                    <td className="px-5 py-4 border-b border-gray-200 text-sm">
                      {editingTechnicianId === technician.id ? (
                        <input
                          type="text"
                          name="technician_name"
                          value={editedTechnician.technician_name}
                          onChange={handleInputChange}
                          className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        technician.technician_name
                      )}
                    </td>
                    <td className="px-5 py-4 border-b border-gray-200 text-sm">
                      {editingTechnicianId === technician.id ? (
                        <select
                          id="department"
                          name="department"
                          value={editedTechnician.department}
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
                        getDepartmentNameById(technician.department)
                      )}
                    </td>
                    <td className="px-5 py-4 border-b border-gray-200 text-sm">
                      {technician.technician_id}
                    </td>
                    <td className="px-5 py-4 border-b border-gray-200 text-sm">
                      <div className="flex justify-center">
                        {editingTechnicianId === technician.id ? (
                          <>
                            <button
                              onClick={handleUpdateTechnician}
                              className="relative inline-flex items-center px-4 py-2 font-semibold leading-tight text-white bg-blue-500 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150"
                            >
                              <span className="relative">Save</span>
                            </button>
                            <button
                              onClick={() => setEditingTechnicianId(null)}
                              className="relative inline-flex items-center px-4 py-2 ml-2 font-semibold leading-tight text-white bg-red-500 rounded-full hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-150"
                            >
                              <span className="relative">Cancel</span>
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleEditTechnician(technician)}
                              className="relative inline-flex items-center px-4 py-2 font-semibold leading-tight text-white bg-blue-500 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150"
                            >
                              <span className="relative">Edit</span>
                            </button>
                            <button
                              onClick={() => handleDeleteTechnician(technician)}
                              className="relative inline-flex items-center px-4 py-2 ml-2 font-semibold leading-tight text-white bg-red-500 rounded-full hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-150"
                            >
                              <span className="relative">Delete</span>
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {editingTechnicianId === -1 && (
        <AddTechnicianForm
          setEditingTechnicianId={setEditingTechnicianId}
          fetchTechnicians={fetchTechnicians}
        />
      )}

      {showDeleteConfirmation && (
        <DeleteConfirmationModal
          technician={technicianToDelete}
          confirmDeleteTechnician={confirmDeleteTechnician}
          cancelDeleteTechnician={cancelDeleteTechnician}
        />
      )}
    </div>
  );
};

const AddTechnicianForm = ({ setEditingTechnicianId, fetchTechnicians }) => {
  const contextData = useContext(AuthContext);
  const [technician, setTechnician] = useState({
    technician_name: "",
    department: "",
    technician_id: "",
  });

  const handleChange = (e) => {
    setTechnician({ ...technician, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Check if technician_name, department, and technician_id are not empty
    if (!technician.technician_name) {
      toast.error("Technician name is required");
      return;
    }

    if (!technician.department) {
      toast.error("Department is required");
      return;
    }

    if (!technician.technician_id) {
      toast.error("Technician ID is required");
      return;
    }
    try {
      await axios.post("/api/add_technician/", technician);
      setEditingTechnicianId(null);
      toast.success("Technician added successfully!");
      fetchTechnicians();
    } catch (error) {
      console.error("Error adding technician:", error);
      toast.error("Error adding Technician");
    }
  };

return (
  <div className="fixed z-10 inset-0 overflow-y-auto bg-gray-800 bg-opacity-50 flex items-center justify-center">
    <div className="bg-white rounded-lg shadow-lg p-8 w-90">
      <h2 className="text-2xl font-bold mb-4">Add Technician</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="technician_name" className="block font-bold mb-2">
            Name
          </label>
          <input
            type="text"
            id="technician_name"
            name="technician_name"
            value={technician.technician_name}
            onChange={handleChange}
            className="border border-gray-400 p-2 w-full rounded-md focus:outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <label htmlFor="department" className="block font-bold mb-2">
            Department
          </label>
          <select
            id="department"
            name="department"
            value={technician.department}
            onChange={handleChange}
            className="w-full border border-gray-400 p-2 rounded-md focus:outline-none focus:border-blue-500"
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
          <label htmlFor="technician_id" className="block font-bold mb-2">
            Technician ID
          </label>
          <input
            type="number"
            id="technician_id"
            name="technician_id"
            value={technician.technician_id}
            onChange={handleChange}
            className="border border-gray-400 p-2 w-full rounded-md focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded mr-2 focus:outline-none focus:ring focus:ring-gray-400"
            onClick={() => setEditingTechnicianId(null)}
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
const DeleteConfirmationModal = ({
  technician,
  confirmDeleteTechnician,
  cancelDeleteTechnician,
}) => {
  return (
    <div className="fixed z-10 inset-0 overflow-y-auto bg-gray-800 bg-opacity-50">
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-4">Delete Technician</h2>
          <p>Are you sure you want to delete {technician.technician_name}?</p>
          <div className="flex justify-end mt-4">
            <button
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded mr-2"
              onClick={cancelDeleteTechnician}
            >
              Cancel
            </button>
            <button
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
              onClick={confirmDeleteTechnician}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechnicianTable; 