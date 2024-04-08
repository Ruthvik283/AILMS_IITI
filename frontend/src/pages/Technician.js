import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import AuthContext from "../context/AuthContext";
import toast from "react-hot-toast";

const TechnicianTable = () => {
  const contextData = useContext(AuthContext);
  const [technicians, setTechnicians] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedTechnician, setSelectedTechnician] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [technicianToDelete, setTechnicianToDelete] = useState(null);

  useEffect(() => {
    fetchTechnicians();
  }, []);

  const fetchTechnicians = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/technicians/"
      );
      setTechnicians(response.data);
    } catch (error) {
      console.error("Error fetching technicians:", error);
    }
  };

  const handleAddTechnician = () => {
    setShowAddForm(true);
  };

  const handleEditTechnician = (technician) => {
    setSelectedTechnician(technician);
    setShowEditForm(true);
  };

  const handleDeleteTechnician = (technician) => {
    setTechnicianToDelete(technician);
    setShowDeleteConfirmation(true);
  };

  const confirmDeleteTechnician = async () => {
    try {
      await axios.delete(
        `http://127.0.0.1:8000/api/delete_technician/${technicianToDelete.id}/delete/`
      );
      toast.success("technician deleted successfully!");
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

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">Technicians</h1>
      <button
        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mb-4"
        onClick={handleAddTechnician}
      >
        Add Technician
      </button>
      {showAddForm && (
        <AddTechnicianForm
          setShowAddForm={setShowAddForm}
          fetchTechnicians={fetchTechnicians}
        />
      )}
      {showEditForm && (
        <EditTechnicianForm
          technician={selectedTechnician}
          setShowEditForm={setShowEditForm}
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
      <table className="table-auto w-full">
        <thead>
          <tr>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Department</th>
            <th className="px-4 py-2">Technician ID</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {technicians.map((technician) => (
            <tr key={technician.id}>
              <td className="border px-4 py-2">{technician.technician_name}</td>
              <td className="border px-4 py-2">{technician.department_name}</td>
              <td className="border px-4 py-2">{technician.technician_id}</td>
              <td className="border px-4 py-2">
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mr-2"
                  onClick={() => handleEditTechnician(technician)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                  onClick={() => handleDeleteTechnician(technician)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const AddTechnicianForm = ({ setShowAddForm, fetchTechnicians }) => {
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
      await axios.post("http://127.0.0.1:8000/api/add_technician/", technician);
      setShowAddForm(false);
      toast.success("Technician added successfully!");
      fetchTechnicians();
    } catch (error) {
      console.error("Error adding technician:", error);
      toast.error("Error adding Technician");
    }
  };

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-4">Add Technician</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="technician_name" className="block font-bold mb-2">
                Name
              </label>
              <input
                type="text"
                id="technician_name"
                name="technician_name"
                value={technician.technician_name}
                onChange={handleChange}
                className="border border-gray-400 p-2 w-full"
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
                value={technician.department}
                onChange={handleChange}
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
            <div className="mb-4">
              <label htmlFor="technician_id" className="block font-bold mb-2">
                Technician ID
              </label>
              <input
                type="number"
                id="technician_id"
                name="technician_id"
                value={technician.technician_id}
                onChange={handleChange}
                className="border border-gray-400 p-2 w-full"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded mr-2"
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
              >
                Add
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const EditTechnicianForm = ({
  technician,
  setShowEditForm,
  fetchTechnicians,
}) => {
  const contextData = useContext(AuthContext);
  const [editedTechnician, setEditedTechnician] = useState(technician);

  const handleChange = (e) => {
    setEditedTechnician({
      ...editedTechnician,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Check if technician_name, department, and technician_id are not empty
    if (!editedTechnician.technician_name) {
      toast.error("Technician name is required");
      return;
    }

    if (!editedTechnician.department) {
      toast.error("Department is required");
      return;
    }

    if (!editedTechnician.technician_id) {
      toast.error("Technician ID is required");
      return;
    }
    try {
      await axios.put(
        `http://127.0.0.1:8000/api/edit_technician/${technician.id}/`,
        editedTechnician
      );
      setShowEditForm(false);
      toast.success("Technician edited successfully!");
      fetchTechnicians();
    } catch (error) {
      console.error("Error editing technician:", error);
      toast.error("error editing technician");
    }
  };

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-4">Edit Technician</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="technician_name" className="block font-bold mb-2">
                Name
              </label>
              <input
                type="text"
                id="technician_name"
                name="technician_name"
                value={editedTechnician.technician_name}
                onChange={handleChange}
                className="border border-gray-400 p-2 w-full"
              />
            </div>
            {/* <div className="mb-4">
            <label htmlFor="department" className="block font-bold mb-2">
              Department
            </label>
            <input
              type="text"
              id="department"
              name="department"
              value={editedTechnician.department}
              onChange={handleChange}
              className="border border-gray-400 p-2 w-full"
            />
          </div> */}
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
                value={editedTechnician.department}
                onChange={handleChange}
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
            <div className="mb-4">
              <label htmlFor="technician_id" className="block font-bold mb-2">
                Technician ID
              </label>
              <input
                type="number"
                id="technician_id"
                name="technician_id"
                value={editedTechnician.technician_id}
                onChange={handleChange}
                className="border border-gray-400 p-2 w-full"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded mr-2"
                onClick={() => setShowEditForm(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
              >
                Save
              </button>
            </div>
          </form>
        </div>
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
    <div className="fixed z-10 inset-0 overflow-y-auto">
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
