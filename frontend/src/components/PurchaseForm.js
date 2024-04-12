import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import AuthContext from "../context/AuthContext";

const PurchaseForm = () => {
  const Navigate = useNavigate();
  const contextData = useContext(AuthContext);
  const [material, setMaterial] = useState("");
  const [materialCode, setMaterialCode] = useState("");
  const [purchase_type, setPurchase_type] = useState("");
  const [quantityPurchased, setQuantityPurchased] = useState("");
  const [vendorDetails, setVendorDetails] = useState("");
  const [invoicePdf, setInvoicePdf] = useState(null);

  function setPdf(targ) {
    console.log(targ.files);
    console.log(JSON.stringify(targ.files[0]));
    setInvoicePdf(targ.files[0]);
    // console.log("file: ", invoicePdf);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("material_id", material);
    formData.append("materialCode", materialCode);
    formData.append("purchase_type", purchase_type);
    formData.append("quantity_purchased", quantityPurchased);
    formData.append("vendor_details", vendorDetails);
    formData.append("invoice_pdf", invoicePdf);

    try {
      // console.log("formData", formData);
      const response = await fetch("/api/add_purchase/", {
        method: "POST",
        // headers: {
        //   "Content-Type": "multipart/form-data",
        // },
        body: formData,
      });

      if (response.ok) {
        console.log("Sanction form submitted successfully!");
        // Reset form fields if needed
        // setMaterial("");
        // setMaterialCode("");
        // setQuantityPurchased("");
        // setVendorDetails("");
        // setInvoicePdf(null);
        toast.success("Purchase added successfully!");
        Navigate("/purchase");
      } else {
        toast.error(`Failed to submit form ${response.status}`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const purchaseType = [
    { name: "Type A" },
    { name: "Type B"},
    {name:"Type C"}
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
            {/* Assuming materials is an array of material names */}
            {contextData.materialsData.map((material) => (
              <option key={material.material_id} value={material.material_id}>
                {material.material_name}
              </option>
            ))}
          </select>
        </div>
        {/* <div>
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
        </div> */}
        
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
            {/* Assuming materials is an array of material names */}
            {purchaseType.map((unit) => (
              <option key={unit.name} value={unit.name}>
                {unit.name}
              </option>
            ))}
          </select>
        </div>
        {/* <div>
          <label htmlFor="purchase_type" className="block mb-1">
            Purchase type
          </label>
          <input
            type="text"
            id="purchase_type"
            value={purchase_type}
            onChange={(e) => setPurchase_type(e.target.value)}
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
          />
        </div> */}
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
            //value={invoicePdf}
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
    </div>
  );
};

export default PurchaseForm;
