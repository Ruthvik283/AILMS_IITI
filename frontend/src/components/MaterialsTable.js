import React from "react";
import { useEffect, useState,useContext } from "react";
import AuthContext from "../context/AuthContext";

const MaterialsTable = () => {
  const contextData = useContext(AuthContext);
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
            {contextData.materialsData.map((material) => (
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
