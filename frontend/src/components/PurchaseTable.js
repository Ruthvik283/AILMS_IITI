import React from "react";
import { useEffect, useState } from "react";

const PurchaseTable = () => {
  const [purchaseData, setPurchaseData] = useState([]);
  const [startDate, setStartDate] = useState("NULL");
  const [endDate, setEndDate] = useState("NULL");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/purchases/${startDate}/${endDate}/`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setPurchaseData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [startDate, endDate]);
  const materialWisePrice = purchaseData.reduce((acc, purchase) => {
    acc["Total Price"] = acc["Total Price"] || 0;
    acc["Total Price"] += purchase.price * purchase.quantity_purchased;

    acc[purchase.material_name] = acc[purchase.material_name] || 0;
    acc[purchase.material_name] += purchase.price * purchase.quantity_purchased;
    return acc;
  }, {});
  const handleStartDateChange = (event) => {
    setStartDate(event.target.value || "NULL");
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value || "NULL");
  };
  return (
    <div>
      <input type="date" onChange={handleStartDateChange} />
      <input type="date" onChange={handleEndDateChange} />
      <h2 className="text-xl font-bold mb-4">Purchase List</h2>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Purchase ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Material
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Quantity Purchased
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Vendor Details
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date & Time
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {purchaseData.map((purchase) => (
            <tr key={purchase.purchase_id}>
              <td className="px-6 py-4 whitespace-nowrap">
                {purchase.purchase_id}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {purchase.material_name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {purchase.quantity_purchased}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {purchase.vendor_details}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {new Date(purchase.date_time).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <h3 className="text-lg font-bold mb-2">
          Total Price: {materialWisePrice["Total Price"]}
        </h3>
        <h3 className="text-lg font-bold mb-2">Material-wise Prices:</h3>
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse border border-gray-400">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2 text-left">Material</th>
                <th className="px-4 py-2 text-left">Price</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(materialWisePrice).map(
                ([material, price]) =>
                  material !== "Total Price" && (
                    <tr key={material} className="border-b border-gray-300">
                      <td className="px-4 py-2">{material}</td>
                      <td className="px-4 py-2">{price}</td>
                    </tr>
                  )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PurchaseTable;
