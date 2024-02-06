import React from "react";
import { useEffect, useState } from "react";

const SanctionTable = () => {
  const [sanctionData, setSanctionData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/sanctions/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setSanctionData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const materialWisePrice = sanctionData.reduce((acc, purchase) => {
    acc["Total Price"] = acc["Total Price"] || 0;
    acc["Total Price"] += purchase.price * purchase.quantity_sanctioned;

    acc[purchase.material_name] = acc[purchase.material_name] || 0;
    acc[purchase.material_name] += purchase.price * purchase.quantity_sanctioned;
    return acc;
  }, {});

  // console.log(sanctionData);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Sanction List</h2>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Sanction ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ticket ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Department
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Engineer ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Technician ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Material
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date & Time
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Quantity Sanctioned
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sanctionData.map((sanction) => (
            <tr key={sanction.sanction_id}>
              <td className="px-6 py-4 whitespace-nowrap">
                {sanction.sanction_id}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {sanction.ticket_id}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {sanction.department}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {sanction.engineer_id}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {sanction.technician_id}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {sanction.material}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {new Date(sanction.date_time).toLocaleString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {sanction.quantity_sanctioned}
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

export default SanctionTable;
