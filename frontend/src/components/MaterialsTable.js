
import React, { useEffect, useState, useContext } from "react";
import toast from "react-hot-toast";
import AuthContext from "../context/AuthContext";

const MaterialsTable = () => {
  const contextData = useContext(AuthContext);
  let {fetchMaterialsData} = useContext(AuthContext);
  const [materialsData, setMaterialsData] = useState([]);
  const [email, setEmail] = useState(null);
  const [showAllMaterials, setShowAllMaterials] = useState(true);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [globalSelectedMaterials, setGlobalSelectedMaterials] = useState([]);
  const [perPage, setPerPage] = useState(5);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [currentEntries, setCurrentEntries] = useState([]);
  const [indexOfLastEntry, setIndexOfLastEntry] = useState(currentPage * perPage);
  const [indexOfFirstEntry, setIndexOfFirstEntry] = useState(indexOfLastEntry - perPage);


  const handlePrevClick = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const handleNextClick = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {

        const materialsData = await fetchMaterialsData();
        const belowCriticalData = materialsData.filter(material => {
            return material.quantity < material.critical_quantity;
          });

        const mergedData = materialsData.map((material) => ({
          ...material,
          belowCritical: belowCriticalData.some(
            (item) => item.material_id === material.material_id
          ),
        }));
        setCurrentPage(1);
        const currentEntries = mergedData.slice(0, perPage);
        setCurrentEntries(currentEntries);
        setMaterialsData(mergedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const filteredMaterials = materialsData.filter((material) => {
    return (
      (showAllMaterials || material.belowCritical) &&
      material.material_name.toLowerCase().includes(search.toLowerCase())
    );
  });

  const handleCheckboxChange = (materialId) => {
    setSelectedMaterials((prevSelected) => {
      const updatedSelected = prevSelected.includes(materialId)
        ? prevSelected.filter((id) => id !== materialId)
        : [...prevSelected, materialId];

      setGlobalSelectedMaterials(updatedSelected);

      return updatedSelected;
    });
  };


  useEffect(() => {
    setIndexOfLastEntry  (currentPage * perPage);
    
    const lastEntryIndex = currentPage * perPage;
    const firstEntryIndex = lastEntryIndex - perPage;
    setIndexOfFirstEntry(lastEntryIndex - perPage);
    const currentEntries = filteredMaterials.slice(firstEntryIndex, lastEntryIndex);
    setCurrentEntries(currentEntries);
  }, [currentPage, perPage, search]);
  
  
  useEffect(()=>{
    setCurrentPage(1);
  },[search,selectedMaterials]);
  const handleSendEmail = async () => {
    try {
      if (globalSelectedMaterials.length === 0) {
        toast.error("No materials selected to send email");
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const isValid = emailRegex.test(email);
      if(!isValid){
        toast.error("Entered email isn't in valid format");
        return;
      }

      toast.success("Sending emails");
      const tokenString = localStorage.getItem('authTokens');
      const token = tokenString ? JSON.parse(tokenString).access : null;
  
      const headers = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      const response = await fetch("/api/sendmail/", {
        method: "POST",
        headers: headers,
        body: JSON.stringify({ selected_materials: globalSelectedMaterials,email: email }),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(data.message);
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to send emails");
      }
    } catch (error) {
      console.error("Error sending emails:", error);
      toast.error("An error occurred while sending emails");
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  return (
    <div className="overflow-x-auto">
      <div className="container mx-auto px-4 bg-[#FFFEFA] sm:px-8 my-5">
        <div className="py-4 px-2">
          <div>
            <h2 className="text-2xl font-semibold leading-tight">
              Material List
            </h2>
          </div>

          <div className="relative flex justify-between tickets my-3">
            <div className="block relative ticketid">
              <span className="h-full absolute inset-y-0 left-0 flex items-center pl-2">
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4 fill-current text-gray-500"
                >
                  <path d="M10 4a6 6 0 100 12 6 6 0 000-12zm-8 6a8 8 0 1114.32 4.906l5.387 5.387a1 1 0 01-1.414 1.414l-5.387-5.387A8 8 0 012 10z" />
                </svg>
              </span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by Material Name"
                className="appearance-none rounded-r rounded-l sm:rounded-l-none border border-gray-400 border-b block pl-8 pr-6 py-2 w-full bg-white text-sm placeholder-gray-400 text-gray-700 focus:bg-white focus:placeholder-gray-600 focus:text-gray-700 focus:outline-none"
              />
            </div>
            
          </div>
          <div className="bg-[#FFFEFA] py-4 md:py-2 px-2 md:px-4 xl:px-1">
            <div className="sm:flex items-center justify-between">
              <div className="flex items-center">
                <div className="relative">
                  <select
                    className="rounded-l border block appearance-none bg-white border-gray-400 text-gray-700 py-2 px-4 pr-8 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    onChange={(e) => {
                      setShowAllMaterials(e.target.value === "All");
                      setCurrentPage(1);
                    }}
                  >
                    <option value="All">All</option>
                    <option value="Below Critical Quantity">
                      Below Critical Quantity
                    </option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
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
                <div className="flex flex-col items-center justify-center">
                  <div className="flex items-center justify-center">
                    {globalSelectedMaterials.length >= 0 && (
                      <button
                        onClick={handleSendEmail}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-4"
                      >
                        Send Email
                      </button>
                    )}
                    <input
                      type="email"
                      value={email}
                      onChange={handleEmailChange}
                      className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="relative flex justify-end my-3">
          <div className="relative perpage ">
              <select
                value={perPage}
                onChange={(e) => setPerPage(parseInt(e.target.value))}
                className="appearance-none h-full border block w-full bg-white border-gray-400 text-gray-700 py-2 px-4 pr-8 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
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
<div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto ">
            <div className="inline-block min-w-full shadow overflow-hidden">
              <table className="min-w-full leading-normal bg-white">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-8 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Material ID
                    </th>
                    <th className="px-8 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-8 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-8 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Quantity
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <span>A</span>
                        <span>B</span>
                      </div>
                    </th>
                    <th className="px-8 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Total Quantity
                    </th>
                    <th className="px-8 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600  tracking-wider">
                     UNIT(s)
                    </th>
                    <th className="px-8 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                     Critical Quantity
                    </th>
                    <th className="px-8 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Rack Number
                    </th>
                    <th className="px-8 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Row Number
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentEntries.map((material) => (
                    <tr
                      key={material.material_id}
                      tabIndex="0"
                      className="focus:outline-none h-16 border border-gray-100 rounded hover:bg-gray-50"
                    >
                      <td className="px-8 py-4 border-b border-gray-200 text-sm">
                        {showAllMaterials ? (
                          material.material_id
                        ) : (
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              value={material.material_id}
                              checked={globalSelectedMaterials.includes(
                                material.material_id
                              )}
                              onChange={() =>
                                handleCheckboxChange(material.material_id)
                              }
                              className="form-checkbox h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="ml-2">{material.material_id}</span>
                          </div>
                        )}
                      </td>
                      <td className="px-8 py-4 border-b border-gray-200 text-sm">
                        {material.material_name}
                      </td>
                      <td className="px-8 py-4 border-b border-gray-200 text-sm">
                        {material.price}
                      </td>
                      <td className="px-8 py-4 border-b border-gray-200 text-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <span>{material.quantity_A}</span>
                          <span>{material.quantity_B}</span>
                        </div>
                      </td>
                      <td
                        className={`px-8 py-4 border-b border-gray-200 text-sm ${
                          material.belowCritical
                            ? "text-red-500"
                            : "text-green-500"
                        }`}
                      >
                        {material.quantity}
                      </td>
                      <td className="px-8 py-4 border-b border-gray-200 text-sm">
                        {material.unit}
                      </td>
                      <td className="px-8 py-4 border-b border-gray-200 text-sm">
                        {material.critical_quantity}
                      </td>
                      <td className="px-8 py-4 border-b border-gray-200 text-sm">
                        {material.rack_number}
                      </td>
                      <td className="px-8 py-4 border-b border-gray-200 text-sm">
                        {material.row_number}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            </div>
            <div className="px-8 bg-[#FFFEFA] border-t flex flex-col xs:flex-row items-center xs:justify-between">
              <span className="text-xs xs:text-sm text-gray-900">
                Showing {indexOfFirstEntry + 1} to{" "}
                {Math.min(indexOfLastEntry, filteredMaterials.length)} of{" "}
                {filteredMaterials.length} Entries
              </span>
              <div className="inline-flex mt-2 xs:mt-0">
                <button
                  className="text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-l"
                  onClick={handlePrevClick}
                  disabled={currentPage === 1}
                >
                  Prev
                </button>
                <button
                  className="text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-r"
                  onClick={handleNextClick}
                  disabled={indexOfLastEntry >= filteredMaterials.length}
                >
                  Next
                </button>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaterialsTable;