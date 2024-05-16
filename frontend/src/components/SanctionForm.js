import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import AuthContext from "../context/AuthContext";
import SearchableDropdown from "./SearchableDropdown";
import { MultiSelect } from "primereact/multiselect";

const ConfirmationPopup = ({
  formData,
  technician,
  departmentName,
  materialDetails,
  engineerName,
  onConfirm,
  onCancel,
}) => {
  const ticketId = formData[0]?.ticket_id;
  const description = formData[0]?.description;

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
          <p className="font-semibold">Ticket ID: {formData[0]?.ticket_id}</p>
          <p className="font-semibold">
            Description: {formData[0]?.description}
          </p>
          <p className="font-semibold">Department: {departmentName}</p>
          <p className="font-semibold">Engineer: {engineerName}</p>
          <p className="font-semibold">Technician: {technician}</p>

          {formData.map((material, index) => (
            <div key={index} className="mb-4">
              <p className="font-semibold">Material: {material.materialName}</p>
              <p className="font-semibold">
                Quantity Sanctioned: {material.quantity_sanctioned}
              </p>
              <p className="font-semibold">
                Sanction Type: {material.sanct_type}
              </p>
            </div>
          ))}
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
  const [technicianName, setTechnicianName] = useState("");
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [materialQuantities, setMaterialQuantities] = useState({});
  const [material, setMaterial] = useState("");
  const [sanct_type, setSanct_type] = useState("");
  const [quantity_sanctioned, setquantity_sanctioned] = useState("");
  const [showConfirmationPopup, setShowConfirmationPopup] = useState(false);
  const [formData, setFormData] = useState({});

  let { fetchMaterialsData } = useContext(AuthContext);
  let { fetchTechnicians } = useContext(AuthContext);
  useEffect(() => {
    fetchMaterialsData();
    fetchTechnicians();
  }, []);

  const handleMaterialChange = (values) => {
    const valuesArray = Array.isArray(values) ? values : [values];
    setSelectedMaterials(valuesArray);
    const newQuantities = {};
    valuesArray.forEach((value) => {
      newQuantities[value.material_id] = {
        sanct_type: materialQuantities[value.material_id]?.sanct_type || "",
        quantity_sanctioned:
          materialQuantities[value.material_id]?.quantity_sanctioned || "",
        QuantityA: value.quantity_A,
        QuantityB: value.quantity_B,
        material_name: value.material_name,
      };
    });
    setMaterialQuantities(newQuantities);
  };

  const handleQuantityChange = (materialId, field, value) => {
    setMaterialQuantities({
      ...materialQuantities,
      [materialId]: {
        ...materialQuantities[materialId],
        [field]: value,
      },
    });
  };

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

    if (selectedMaterials.length == 0) {
      toast.error("Please select a material");
      return;
    }
    const invalidMaterials = [];
    selectedMaterials.forEach((material) => {
      const materialId = material.material_id;
      const sanct_type = materialQuantities[materialId].sanct_type;
      const quantity_sanctioned =
        materialQuantities[materialId].quantity_sanctioned;
      const QuantityA = materialQuantities[materialId].QuantityA;
      const QuantityB = materialQuantities[materialId].QuantityB;
      const material_name = materialQuantities[materialId].material_name;

      if (quantity_sanctioned === "") {
        invalidMaterials.push(material_name);
        toast.error(`Please enter quantity approved for ${material_name}`);
        return;
      } else if (sanct_type === "") {
        invalidMaterials.push(material_name);
        toast.error(`Please select approval category for ${material_name}`);
        return;
      } else if (
        sanct_type === "A" &&
        parseInt(quantity_sanctioned) > QuantityA
      ) {
        invalidMaterials.push(material_name);
        toast.error(
          `Quantity approved for ${material_name} cannot be more than available quantity`
        );
        return;
      } else if (
        sanct_type === "B" &&
        parseInt(quantity_sanctioned) > QuantityB
      ) {
        invalidMaterials.push(material_name);
        toast.error(
          `Quantity sanctioned for ${material_name} cannot be more than available quantity`
        );
        return;
      }
    });
    if (invalidMaterials.length > 0) {
      return;
    }

    // const formDataArray = selectedMaterials.map((material) => {
    //   const materialId = material.material_id;
    //   const { sanct_type, quantity_sanctioned } = materialQuantities[materialId];
    //   return {
    //     ticket_id: ticketId,
    //     description: description,
    //     engineer_id: engineerId,
    //     department: department,
    //     technician_id: technicianId,
    //     material_id: materialId,
    //     quantity_sanctioned: quantity_sanctioned,
    //     userData: contextData.userData,
    //     sanct_type: sanct_type,
    //   };
    // });
    const formDataArray = selectedMaterials.map((material) => {
      const materialId = material.material_id;
      const { sanct_type, quantity_sanctioned } =
        materialQuantities[materialId];
      return {
        ticket_id: ticketId,
        description: description,
        engineer_id: engineerId,
        department: department,
        technician_id: technicianId,
        material_id: materialId,
        quantity_sanctioned: quantity_sanctioned,
        userData: contextData.userData,
        sanct_type: sanct_type,
      };
    });
    // console.log("formData", formDataArray);

    const formattedFormData = formDataArray.map((formData) => ({
      ticket_id: formData.ticket_id,
      description: formData.description,
      department: formData.department,
      materialName: contextData.materialsData.find(
        (material) => material.material_id === formData.material_id
      ).material_name,
      material_id: formData.material_id,
      engineer_id: formData.engineer_id,
      technician_id: formData.technician_id,
      quantity_sanctioned: formData.quantity_sanctioned,
      sanct_type: formData.sanct_type,
    }));
    // console.log("formatted", formattedFormData);

    setFormData(formattedFormData);
    setShowConfirmationPopup(true);
  };

  const handleConfirmSubmit = async () => {
    try {
      const tokenString = localStorage.getItem("authTokens");
      const token = tokenString ? JSON.parse(tokenString).access : null;

      const headers = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      const response = await fetch("/api/sanction/", {
        method: "POST",
        headers: headers,
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Reset form fields if needed
        setTicketId("");
        setDepartment("");
        setEngineerId(contextData.userData.id);
        setTechnicianId("");
        setTechnicianName("");
        setMaterial("");
        setSanct_type("");
        setquantity_sanctioned("");
        toast.success("Successfully Sanctioned!");
        Navigate("/sanction");
      } else {
        toast.error("Failed to submit form");
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
    return dict;
  };

  const handleChange = (value) => {
    const selectedMaterial = contextData.materialsData.find(
      (mat) => mat.material_name === value
    );
    if (selectedMaterial) {
      setMaterial(selectedMaterial.material_id.toString());
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-4 ">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="ticketId" className="block mb-1">
            TICKET ID
          </label>
          <input
            type="number"
            min="0"
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
          <label htmlFor="department" className="block mb-1">
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
            Engineer Name
          </label>
          <input
            type="text"
            id="engineerId"
            value={contextData.userData.username}
            readOnly
            style={{ pointerEvents: "none" }}
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <label htmlFor="Technician" className="block mb-1">
            Technician Details
          </label>
          <select
            id="Technician"
            value={technicianId}
            // onChange={(e) => {
            //   const selectedTechnicianId = e.target.value;
            //   const selectedTechnician = contextData.techniciansData.find(
            //     (technician) => technician.id === parseInt(selectedTechnicianId)
            //   );

            //   if (selectedTechnician) {
            //     setTechnicianId(selectedTechnicianId);
            //     setTechnicianName(
            //       '${selectedTechnician.technician_name}-${selectedTechnician.technician_id}'
            //     );
            //   } else {
            //     setTechnicianId("");
            //     setTechnicianName("");
            //   }
            // }}
            onChange={(e) => {
              const selectedTechnicianId = e.target.value;
              const selectedTechnician = contextData.techniciansData.find(
                (technician) => technician.id === parseInt(selectedTechnicianId)
              );

              if (selectedTechnician) {
                setTechnicianId(selectedTechnicianId);
                const technicianName = `${
                  selectedTechnician.technician_name ||
                  selectedTechnician.name ||
                  ""
                }-${
                  selectedTechnician.technician_id ||
                  selectedTechnician.id ||
                  ""
                }`;
                setTechnicianName(technicianName);
              } else {
                setTechnicianId("");
                setTechnicianName("");
              }
            }}
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
            Select Materials
          </label>
          <MultiSelect
            value={selectedMaterials}
            options={contextData.materialsData}
            onChange={(e) => handleMaterialChange(e.value)}
            optionLabel="material_name"
            placeholder="Select Materials"
            filter
            className="multiselect-custom"
          />
        </div>

        {selectedMaterials.length > 0 && (
          <div>
            {selectedMaterials.map((material) => (
              <div
                key={material.material_id}
                className="mb-4 rounded-lg p-2 bg-slate-50"
              >
                <h3 className="text-lg font-semibold mb-2">
                  {material.material_name}
                </h3>
                <div className="mt-2">
                  <label className="block mb-1">Available Quantity</label>
                  <p className="text-sm text-gray-900">
                    Category-A:{" "}
                    {materialQuantities[material.material_id].QuantityA},
                    Category-B:{" "}
                    {materialQuantities[material.material_id].QuantityB}
                  </p>
                </div>
                <div>
                  <label htmlFor="materialCategory" className="block mb-1">
                    Material Category
                  </label>
                  <select
                    id="materialCategory"
                    value={materialQuantities[material.material_id].sanct_type}
                    onChange={(e) =>
                      handleQuantityChange(
                        material.material_id,
                        "sanct_type",
                        e.target.value
                      )
                    }
                    className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
                  >
                    <option value="">Select Category</option>
                    <option value="A">Category A</option>
                    <option value="B">Category B</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="quantity_sanctioned" className="block mb-1">
                    Quantity Sanctioned
                  </label>
                  <input
                    type="number"
                    min="1"
                    id="quantity_sanctioned"
                    value={
                      materialQuantities[material.material_id]
                        .quantity_sanctioned
                    }
                    onChange={(e) =>
                      handleQuantityChange(
                        material.material_id,
                        "quantity_sanctioned",
                        e.target.value
                      )
                    }
                    className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
        <div>
          <button
            type="submit"
            className="w-full bg-[#52ab98] text-white py-2 px-4 rounded hover:bg-[#2b6777] transition duration-200"
          >
            Submit
          </button>
        </div>
      </form>
      {/* {showConfirmationPopup && (
        <ConfirmationPopup
          formData={{
            ticket_id: ticketId,
            description: description,
            quantity_sanctioned: quantity_sanctioned,
            sanct_type: sanct_type,
          }}
          technician={technicianName}
          departmentName={
            contextData.userData.department.department_name ||
            contextData.userData.department.sub_department_name
          }
          materialName={selectedMaterials.map(
            (material) => material.material_name
          )}
          engineerName={contextData.userData.username}
          onConfirm={() => handleConfirmSubmit(formData)}
          onCancel={handleCancelConfirmation}
        />
      )} */}
      {showConfirmationPopup && (
        <ConfirmationPopup
          formData={formData}
          technician={technicianName}
          departmentName={contextData.userData.department.department_name}
          materialDetails={formData.map((material) => material.materialName)}
          engineerName={contextData.userData.username}
          onConfirm={() => handleConfirmSubmit()}
          onCancel={handleCancelConfirmation}
        />
      )}
    </div>
  );
};

export default SanctionForm;
