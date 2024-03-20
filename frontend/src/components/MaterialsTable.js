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
    <div className=" bg-[#C8D8D4] overflow-x-auto">
    <h1 className="text-2xl font-bold mb-4 p-4 px-6">Material List</h1>
    <div className="min-h-screen flex justify-center items-center">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-4 py-2 w-full">
        <div className="inline-block min-w-full shadow rounded-lg overflow-hidden ">
        <table className="w-full leading-normal table-auto">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider bg-[#2b6777] ">
                Material ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider bg-[#2b6777] ">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider bg-[#2b6777] ">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider bg-[#2b6777] ">
                Quantity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider bg-[#2b6777] ">
                Rack Number
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider bg-[#2b6777] ">
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
      </div>
    </div>
    </div>
    </>
  );
};

export default MaterialsTable;
