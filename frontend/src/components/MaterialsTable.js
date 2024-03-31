// import React, { useEffect, useState } from "react";

// const MaterialsTable = () => {
//   const [materialsData, setMaterialsData] = useState([]);
//   const [showAllMaterials, setShowAllMaterials] = useState(true);
//   const [selectedMaterials, setSelectedMaterials] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const materialsResponse = await fetch("http://127.0.0.1:8000/api/materials");
//         const belowCriticalResponse = await fetch("http://127.0.0.1:8000/api/belowCritical/");
        
//         if (!materialsResponse.ok || !belowCriticalResponse.ok) {
//           throw new Error(`HTTP error! Status: ${materialsResponse.status}`);
//         }

//         const materialsData = await materialsResponse.json();
//         const belowCriticalData = await belowCriticalResponse.json();

//         // Combine data from both responses
//         const mergedData = materialsData.map(material => ({
//           ...material,
//           belowCritical: belowCriticalData.some(item => item.material_id === material.material_id)
//         }));

//         setMaterialsData(mergedData);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };
//     fetchData();
//   }, []);

//   // Filter materials based on the selected option
//   const filteredMaterials = showAllMaterials
//     ? materialsData
//     : materialsData.filter(material => material.belowCritical);

//   // Handler for checkbox change
//   const handleCheckboxChange = (materialId) => {
//     setSelectedMaterials(prevSelected => {
//       if (prevSelected.includes(materialId)) {
//         return prevSelected.filter(id => id !== materialId);
//       } else {
//         return [...prevSelected, materialId];
//       }
//     });
//   };

//   // Handler for sending email for selected materials
//   const handleSendEmail = () => {
//     console.log("Sending email for selected materials:", selectedMaterials);
//   };

//   return (
//     <div className="bg-[#FFFEFA] overflow-x-auto relative">
//       <h1 className="text-2xl font-bold mb-4 p-4 px-6">Material List</h1>
//       <div className="bg-[#FFFEFA] py-4 md:py-7 px-4 md:px-8 xl:px-10">
//         <div className="sm:flex items-center justify-between">
//           <div className="flex items-center">
//             <button
//               className={`rounded-full focus:outline-none focus:ring-2 focus:bg-indigo-50 focus:ring-indigo-800 ${
//                 showAllMaterials ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:text-indigo-700 hover:bg-indigo-100'
//               } py-2 px-8`}
//               onClick={() => setShowAllMaterials(true)}
//             >
//               <p>All</p>
//             </button>
//             <button
//               className={`rounded-full focus:outline-none focus:ring-2 focus:bg-indigo-50 focus:ring-indigo-800 ml-4 sm:ml-8 ${
//                 !showAllMaterials ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:text-indigo-700 hover:bg-indigo-100'
//               } py-2 px-8`}
//               onClick={() => setShowAllMaterials(false)}
//             >
//               <p>Below Critical Quantity</p>
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
//         <div className="inline-block min-w-full shadow overflow-hidden">
//           <table className="min-w-full leading-normal bg-white">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                   Material ID
//                 </th>
//                 <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                   Name
//                 </th>
//                 <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                   Price
//                 </th>
//                 <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                   Quantity
//                 </th>
//                 <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                   Rack Number
//                 </th>
//                 <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                   Row Number
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredMaterials.map((material) => (
//                 <tr key={material.material_id} tabIndex="0" className="focus:outline-none h-16 border border-gray-100 rounded hover:bg-gray-50">
//                   <td className="px-5 py-4 border-b border-gray-200 text-sm">
//                     {showAllMaterials ? (
//                       material.material_id
//                     ) : (
//                       <div className="flex items-center">
//                         <input
//                           type="checkbox"
//                           value={material.material_id}
//                           onChange={() => handleCheckboxChange(material.material_id)}
//                           className="form-checkbox h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
//                         />
//                         <span className="ml-2">{material.material_id}</span>
//                       </div>
//                     )}
//                   </td>
//                   <td className="px-5 py-4 border-b border-gray-200 text-sm">
//                     {material.material_name}
//                   </td>
//                   <td className="px-5 py-4 border-b border-gray-200 text-sm">
//                     {material.price}
//                   </td>
//                   <td
//                     className={`px-5 py-4 border-b border-gray-200 text-sm ${
//                       material.belowCritical ? 'text-red-500' : 'text-green-500'
//                     }`}
//                   >
//                     {material.quantity}
//                   </td>
//                   <td className="px-5 py-4 border-b border-gray-200 text-sm">
//                     {material.rack_number}
//                   </td>
//                   <td className="px-5 py-4 border-b border-gray-200 text-sm">
//                     {material.row_number}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MaterialsTable;

import React, { useEffect, useState } from "react";

const MaterialsTable = () => {
  const [materialsData, setMaterialsData] = useState([]);
  const [showAllMaterials, setShowAllMaterials] = useState(true);
  const [selectedMaterials, setSelectedMaterials] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const materialsResponse = await fetch("http://127.0.0.1:8000/api/materials");
        const belowCriticalResponse = await fetch("http://127.0.0.1:8000/api/belowCritical/");
        
        if (!materialsResponse.ok || !belowCriticalResponse.ok) {
          throw new Error(`HTTP error! Status: ${materialsResponse.status}`);
        }

        const materialsData = await materialsResponse.json();
        const belowCriticalData = await belowCriticalResponse.json();

        // Combine data from both responses
        const mergedData = materialsData.map(material => ({
          ...material,
          belowCritical: belowCriticalData.some(item => item.material_id === material.material_id)
        }));

        setMaterialsData(mergedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  // Filter materials based on the selected option
  const filteredMaterials = showAllMaterials
    ? materialsData
    : materialsData.filter(material => material.belowCritical);

  // Handler for checkbox change
  const handleCheckboxChange = (materialId) => {
    setSelectedMaterials(prevSelected => {
      if (prevSelected.includes(materialId)) {
        return prevSelected.filter(id => id !== materialId);
      } else {
        return [...prevSelected, materialId];
      }
    });
  };

  // Handler for sending email for selected materials
  const handleSendEmail = () => {
    console.log("Sending email for selected materials:", selectedMaterials);
  };

  return (
    <div className="bg-[#FFFEFA] overflow-x-auto relative mx-10 my-4">
      <h1 className="text-2xl font-bold px-4">Material List</h1>
      <div className="bg-[#FFFEFA] py-4 md:py-2 px-4 md:px-4 xl:px-4">
        <div className="sm:flex items-center justify-between">
          <div className="flex items-center">
            {/* Dropdown for selecting material type */}
            <div className="relative">
              <select
                className="appearance-none rounded-l border block appearance-none bg-white border-gray-400 text-gray-700 py-2 px-4 pr-8 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                onChange={(e) => {
                  // Handle logic for selecting material type
                  setShowAllMaterials(e.target.value === "All");
                }}
              >
                <option value="All">All</option>
                <option value="Below Critical Quantity">Below Critical Quantity</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-700">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>
          {showAllMaterials ? null : (
            <div>
              {selectedMaterials.length > 0 && (
                <button
                  onClick={handleSendEmail}
                  className="ml-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 rounded m-4"
                >
                  Send Email
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="-mx-4 sm:-mx-8 px-4 sm:px-4 py-10 overflow-x-auto p-4">
        <div className="inline-block min-w-full shadow overflow-hidden">
          <table className="min-w-full leading-normal bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Material ID
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Rack Number
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Row Number
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredMaterials.map((material) => (
                <tr key={material.material_id} tabIndex="0" className="focus:outline-none h-16 border border-gray-100 rounded hover:bg-gray-50">
                  <td className="px-5 py-4 border-b border-gray-200 text-sm">
                    {showAllMaterials ? (
                      material.material_id
                    ) : (
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          value={material.material_id}
                          onChange={() => handleCheckboxChange(material.material_id)}
                          className="form-checkbox h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="ml-2">{material.material_id}</span>
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-4 border-b border-gray-200 text-sm">
                    {material.material_name}
                  </td>
                  <td className="px-5 py-4 border-b border-gray-200 text-sm">
                    {material.price}
                  </td>
                  <td
                    className={`px-5 py-4 border-b border-gray-200 text-sm ${
                      material.belowCritical ? 'text-red-500' : 'text-green-500'
                    }`}
                  >
                    {material.quantity}
                  </td>
                  <td className="px-5 py-4 border-b border-gray-200 text-sm">
                    {material.rack_number}
                  </td>
                  <td className="px-5 py-4 border-b border-gray-200 text-sm">
                    {material.row_number}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MaterialsTable;
