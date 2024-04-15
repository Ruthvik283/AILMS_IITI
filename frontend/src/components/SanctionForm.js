import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import AuthContext from "../context/AuthContext";

const ConfirmationPopup = ({ formData, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Confirm Sanction</h2>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <svg
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
        <div className="mb-4">
          <p className="font-semibold">Ticket ID: {formData.ticket_id}</p>
          <p className="font-semibold">Description: {formData.description}</p>
          <p className="font-semibold">Department: {formData.department}</p>
          <p className="font-semibold">Engineer ID: {formData.engineer_id}</p>
          <p className="font-semibold">
            Technician ID: {formData.technician_id}
          </p>
          <p className="font-semibold">Material: {formData.material_id}</p>
          <p className="font-semibold">
            Quantity Sanctioned: {formData.quantity_sanctioned}
          </p>
          <p className="font-semibold">Sanction Type: {formData.sanct_type}</p>
        </div>
        <div className="flex justify-end">
          <button
            onClick={onConfirm}
            className="bg-green-500 text-white py-2 px-4 rounded-full hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 mr-2"
          >
            Confirm
          </button>
          <button
            onClick={onCancel}
            className="bg-gray-300 text-gray-700 py-2 px-4 rounded-full hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const SanctionForm = () => {
  const contextData = useContext(AuthContext);
  const Navigate = useNavigate();
  const [ticketId, setTicketId] = useState("");
  const [description, setDescription] = useState("");
  const [department, setDepartment] = useState("");
  const [engineerId, setEngineerId] = useState(contextData.userData.id);
  const [technicianId, setTechnicianId] = useState("");
  const [material, setMaterial] = useState("");
  const [selectedMaterialQuantityA, setSelectedMaterialQuantityA] =
    useState("");
  const [selectedMaterialQuantityB, setSelectedMaterialQuantityB] =
    useState("");
  const [sanct_type, setSanct_type] = useState("");
  const [quantitySanctioned, setQuantitySanctioned] = useState("");
  const [showConfirmationPopup, setShowConfirmationPopup] = useState(false);
  const [formData, setFormData] = useState({});

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (ticketId === "" && description === "") {
      toast.error("Either ticket-id or description must be present");
      return;
    }
    if (department === "") {
      toast.error("Please select a department");
      return;
    }

    if (technicianId === "") {
      toast.error("Please select a technician");
      return;
    }

    if (material === "") {
      toast.error("Please select a material");
      return;
    }

    if (quantitySanctioned === "") {
      toast.error("Please enter quantity sanctioned");
      return;
    }

    if (sanct_type === "") {
      toast.error("Please select a sanction type");
      return;
    }

    if (
      sanct_type === "A" &&
      parseInt(quantitySanctioned) > selectedMaterialQuantityA
    ) {
      toast.error(
        "Quantity sanctioned for cannot be more than available quantity"
      );
      return;
    }

    if (
      sanct_type === "B" &&
      parseInt(quantitySanctioned) > selectedMaterialQuantityB
    ) {
      toast.error("Quantity sanctioned cannot be more than available quantity");
      return;
    }

    const formData = {
      ticket_id: ticketId,
      description: description,
      engineer_id: engineerId,
      department: department,
      technician_id: technicianId,
      material_id: material,
      quantity_sanctioned: quantitySanctioned,
      userData: contextData.userData,
      sanct_type: sanct_type,
    };

    setFormData(formData);
    setShowConfirmationPopup(true);
  };

  const handleConfirmSubmit = async () => {
    try {
      const response = await fetch("/api/sanction/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Reset form fields if needed
        setTicketId("");
        setDepartment("");
        setEngineerId("");
        setTechnicianId("");
        setMaterial("");
        setSelectedMaterialQuantityB("");
        setSelectedMaterialQuantityA("");
        setSanct_type("");
        setQuantitySanctioned("");
        toast.success("Successfully Sanctioned!");
        console.log(response, JSON.stringify(formData));
        Navigate("/sanction");
      } else {
        toast.error("Failed to submit form");
        console.log(response, JSON.stringify(formData));
      }
    } catch (error) {
      toast.error("Error submitting form:", error);
    } finally {
      setShowConfirmationPopup(false);
    }
  };

  const handleCancelConfirmation = () => {
    setShowConfirmationPopup(false);
  };

  const userDepts = (depts) => {
    const dict = [];
    const dict2 = {
      id: depts.id,
      department_name: depts.department_name,
    };
    dict.push(dict2);

    depts.sub_departments.forEach((subDept) => {
      dict.push(subDept);
    });
    console.log(dict);
    return dict;
  };

  return (
    <div className="max-w-md mx-auto mt-8 ">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="ticketId" className="block mb-1">
            TICKET ID
          </label>
          <input
            type="number"
            min="0"
            style={{
              "-moz-appearance": "textfield" /* Firefox */,
              "-webkit-appearance": "none" /* WebKit */,
              margin: 0 /* Optional: Adjust as needed */,
              appearance: "textfield" /* Edge and other modern browsers */,
            }}
            id="ticketId"
            value={ticketId}
            onChange={(e) => setTicketId(e.target.value)}
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <label htmlFor="description" className="block mb-1">
            DESCRIPTION
          </label>
          <input
            type="text"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <label htmlFor="materialCode" className="block mb-1">
            Department
          </label>
          <select
            id="department"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
          >
            <option value="">Select Department</option>
            {userDepts(contextData.userData.department).map((department) => (
              <option key={department.id} value={department.id}>
                {department.department_name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="engineerId" className="block mb-1">
            ENGINEER ID
          </label>
          {contextData.userData.role === "Manager" ? (
            <input
              type="text"
              id="engineerId"
              value={engineerId}
              onChange={(e) => setEngineerId(e.target.value)}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
            />
          ) : (
            <input
              type="text"
              id="engineerId"
              value={contextData.userData.id}
              readOnly
              style={{ pointerEvents: "none" }}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
            />
          )}
        </div>
        <div>
          <label htmlFor="Technician" className="block mb-1">
            Technician
          </label>
          <select
            id="Technician"
            value={technicianId}
            onChange={(e) => setTechnicianId(e.target.value)}
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
          >
            <option value="">Select technician</option>
            {contextData.techniciansData.map((technician) => (
              <option key={technician.id} value={technician.id}>
                {technician.technician_name}-{technician.technician_id}
              </option>
            ))}
          </select>
        </div>
        <div className="mt-4">
          <label htmlFor="materialCode" className="block mb-1">
            Material
          </label>
          <select
            id="materialCode"
            value={material}
            onChange={(e) => {
              setMaterial(e.target.value);
              const selectedMaterial = contextData.materialsData.find(
                (mat) => mat.material_id === parseInt(e.target.value)
              );
              console.log(contextData.materialsData);
              console.log("Selected material:", selectedMaterial);
              if (selectedMaterial) {
                setSelectedMaterialQuantityA(selectedMaterial.quantity_A);
                setSelectedMaterialQuantityB(selectedMaterial.quantity_B);
              }
            }}
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
          >
            <option value="">Select a material</option>
            {contextData.materialsData.map((material) => (
              <option key={material.material_id} value={material.material_id}>
                {material.material_name}
              </option>
            ))}
          </select>
          <div className="mt-2">
            <label className="block mb-1">Available Quantity</label>
            {material ? (
              <p className="text-sm text-gray-900">
                Category-A: {selectedMaterialQuantityA}, Category-B:{" "}
                {selectedMaterialQuantityB}
              </p>
            ) : (
              <p className="text-sm text-gray-500">
                Quantity will be displayed once the material is selected
              </p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="materialCategory" className="block mb-1">
            Material Category
          </label>
          <select
            id="materialCategory"
            value={sanct_type}
            onChange={(e) => setSanct_type(e.target.value)}
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
          >
            <option value="">Select the category</option>
            <option value="A">A</option>
            <option value="B">B</option>
          </select>
        </div>
        <div>
          <label htmlFor="quantitySanctioned" className="block mb-1">
            QUANTITY SANCTIONED
          </label>
          <input
            type="number"
            id="quantitySanctioned"
            min="1"
            value={quantitySanctioned}
            onChange={(e) => setQuantitySanctioned(e.target.value)}
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-[#52ab98] text-white py-2 px-4 rounded hover:bg-[#2b6777] transition duration-200"
        >
          Submit
        </button>
      </form>
      {showConfirmationPopup && (
        <ConfirmationPopup
          formData={formData}
          onConfirm={handleConfirmSubmit}
          onCancel={handleCancelConfirmation}
        />
      )}
    </div>
  );
};

export default SanctionForm;
