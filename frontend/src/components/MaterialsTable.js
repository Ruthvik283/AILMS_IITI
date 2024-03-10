import React from "react";
import { useEffect, useState } from "react";

const MaterialsTable = () => {
  const [materialsData, setMaterialsData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/materials", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setMaterialsData(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);
  return (
    <>
      <div className="min-h-screen">
        <h2 className="text-xl font-bold mb-4">Material List</h2>
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Material ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quantity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rack Number
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Row Number
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {materialsData.map((material) => (
              <tr key={material.material_id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  {material.material_id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {material.material_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {material.price}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {material.quantity}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {material.rack_number}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {material.row_number}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default MaterialsTable;
