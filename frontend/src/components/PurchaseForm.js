import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const PurchaseForm = () => {
  const Navigate = useNavigate();
  const [material, setMaterial] = useState("");
  const [materialCode, setMaterialCode] = useState("");
  const [quantityPurchased, setQuantityPurchased] = useState("");
  const [vendorDetails, setVendorDetails] = useState("");
  const [invoicePdf, setInvoicePdf] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("material_id", material);
    formData.append("materialCode", materialCode);
    formData.append("quantity_purchased", quantityPurchased);
    formData.append("vendor_details", vendorDetails);
    formData.append("invoice_pdf", invoicePdf);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/add_purchase/", {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log("Sanction form submitted successfully!");
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
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="material" className="block mb-1">
            MATERIAL
          </label>
          <input
            type="text"
            id="material"
            value={material}
            onChange={(e) => setMaterial(e.target.value)}
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <label htmlFor="materialCode" className="block mb-1">
            Material code
          </label>
          <input
            type="text"
            id="materialCode"
            value={materialCode}
            onChange={(e) => setMaterialCode(e.target.value)}
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <label htmlFor="quantityPurchased" className="block mb-1">
            QUANTITY PURCHASED
          </label>
          <input
            type="text"
            id="quantityPurchased"
            value={quantityPurchased}
            onChange={(e) => setQuantityPurchased(e.target.value)}
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
          />
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
            invoice pdf
          </label>
          <input
            type="file"
            id="invoicePdf"
            //value={invoicePdf}
            onChange={(e) => setInvoicePdf(e.target.files[0])}
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default PurchaseForm;
