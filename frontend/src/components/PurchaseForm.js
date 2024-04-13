import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import AuthContext from "../context/AuthContext";

const ConfirmationPopup = ({ formData, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Confirm Purchase</h2>
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
          <p className="font-semibold">Material: {formData.material_id}</p>
          <p className="font-semibold">Material Code: {formData.materialCode}</p>
          <p className="font-semibold">Purchase Type: {formData.purchase_type}</p>
          <p className="font-semibold">Quantity Purchased: {formData.quantity_purchased}</p>
          <p className="font-semibold">Vendor Details: {formData.vendor_details}</p>
          <p className="font-semibold">Invoice PDF: {formData.invoice_pdf?.name}</p>
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

const PurchaseForm = () => {
  const Navigate = useNavigate();
  const contextData = useContext(AuthContext);
  const [material, setMaterial] = useState("");
  const [materialCode, setMaterialCode] = useState("");
  const [purchase_type, setPurchase_type] = useState("");
  const [quantityPurchased, setQuantityPurchased] = useState("");
  const [vendorDetails, setVendorDetails] = useState("");
  const [invoicePdf, setInvoicePdf] = useState(null);
  const [showConfirmationPopup, setShowConfirmationPopup] = useState(false);
  const [formData, setFormData] = useState({});

  function setPdf(targ) {
    console.log(targ.files);
    console.log(JSON.stringify(targ.files[0]));
    setInvoicePdf(targ.files[0]);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = {
      material_id: material,
      materialCode: materialCode,
      purchase_type: purchase_type,
      quantity_purchased: quantityPurchased,
      vendor_details: vendorDetails,
      invoice_pdf: invoicePdf,
    };

    setFormData(formData);
    setShowConfirmationPopup(true);
  };

  const handleConfirmSubmit = async () => {
    try {
      const response = await fetch("/api/add_purchase/", {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });

      if (response.ok) {
        // Reset form fields if needed
        setMaterial("");
        setMaterialCode("");
        setQuantityPurchased("");
        setVendorDetails("");
        setInvoicePdf(null);
        toast.success("Purchase added successfully!");
        Navigate("/purchase");
      } else {
        toast.error(`Failed to submit form ${response.status}`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setShowConfirmationPopup(false);
    }
  };

  const handleCancelConfirmation = () => {
    setShowConfirmationPopup(false);
  };

  const purchaseType = [
    { name: "Type A" },
    { name: "Type B" },
    { name: "Type C" },
  ];

  return (
    <div className="max-w-md min-h-screen mx-auto mt-8">
      <form onSubmit={handleSubmit} className="space-y-4 py-8">
        <div>
          <label htmlFor="materialCode" className="block mb-1">
            MATERIAL
          </label>
          <select
            id="materialCode"
            value={material}
            onChange={(e) => setMaterial(e.target.value)}
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
          >
            <option value="">Select a material</option>
            {contextData.materialsData.map((material) => (
              <option key={material.material_id} value={material.material_id}>
                {material.material_name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="quantityPurchased" className="block mb-1">
            QUANTITY PURCHASED
          </label>
          <input
            type="number"
            id="quantityPurchased"
            value={quantityPurchased}
            onChange={(e) => setQuantityPurchased(e.target.value)}
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <label htmlFor="purchase_type" className="block mb-1">
            Purchase Type
          </label>
          <select
            id="purchase_type"
            value={purchase_type}
            onChange={(e) => setPurchase_type(e.target.value)}
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
          >
            <option value="">Select a Purchase</option>
            {purchaseType.map((unit) => (
              <option key={unit.name} value={unit.name}>
                {unit.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="vendorDetails" className="block mb-1">
            VENDOR DETAILS
          </label>
          <input
            type="text"
            id="vendorDetails"
            value={vendorDetails}
            onChange={(e) => setVendorDetails(e.target.value)}
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <label htmlFor="invoicePdf" className="block mb-1">
            INVOICE PDF
          </label>
          <input
            type="file"
            id="invoicePdf"
            onChange={(e) => setPdf(e.target)}
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

export default PurchaseForm;