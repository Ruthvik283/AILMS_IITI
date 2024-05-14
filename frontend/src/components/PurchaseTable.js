import React from "react";
import { useEffect, useState ,useContext} from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import SearchableDropdown from "./SearchableDropdown";


const PurchaseTable = () => {
  const [purchaseData, setPurchaseData] = useState([]);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  let [materialWisePrice, setmaterialWisePrice] = useState({});
  const [filteredList, setFilteredList] = useState([]);
  const [selectedMaterialName, setSelectedMaterialName] = useState("All");
  const contextData = useContext(AuthContext);



  const [perPage, setPerPage] = useState(5);
  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLastEntry = currentPage * perPage;
  const indexOfFirstEntry = indexOfLastEntry - perPage;
  const currentEntries = filteredList.slice(
    indexOfFirstEntry,
    indexOfLastEntry
  );

  const handlePrevClick = () => {
    setCurrentPage(currentPage - 1);
  };

  const handleNextClick = () => {
    setCurrentPage(currentPage + 1);
  };

  const statusOptions = [{ value: "Closed" }, { value: "Open" }];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tokenString = localStorage.getItem("authTokens");
        const token = tokenString ? JSON.parse(tokenString).access : null;
        
        // console.log("token",token)
        const headers = {
          'Content-Type': 'application/json',
        };
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }
        const response = await fetch(
          `/api/purchases/NULL/NULL/`,
          {
            method: "GET",
            headers: headers,
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        const sortedItems = data.sort((a, b) => {
            // Convert sanction-date strings to Date objects for comparison
            const dateA = new Date(a.date_time);
            const dateB = new Date(b.date_time);
            // Compare dates in reverse order (most recent first)
            return dateB - dateA;
        });
        setPurchaseData(sortedItems);
        //console.log("PurchaseData", data);
        setmaterialWisePrice(
          data.reduce((acc, purchase) => {
            acc["Total Price"] = acc["Total Price"] || 0;
            acc["Total Price"] += purchase.price * purchase.quantity_purchased;

            acc[purchase.material] = acc[purchase.material] || 0;
            acc[purchase.material] +=
              purchase.price * purchase.quantity_purchased;
            return acc;
          }, {})
        );

        setFilteredList(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  const filterByDate = (filteredData) => {
    let filteredByDate = filteredData;

    // If start date is null, set it to the earliest possible date
    const startDateFilter = startDate ? new Date(startDate) : new Date(0);

    // If end date is null, set it to the current date
    const endDateFilter = endDate ? new Date(endDate) : new Date();
    const nextDayDate = endDateFilter;
    nextDayDate.setDate(nextDayDate.getDate() + 1);
    //endDate.setendDate(endDate.getDate() + 1);
    //console.log(startDateFilter, endDateFilter);

    filteredByDate = filteredData.filter(
      (purchase) =>
        new Date(purchase.date_time) >= startDateFilter &&
        new Date(purchase.date_time) < nextDayDate
    );

    return filteredByDate;
  };

  const filterByMaterialName = (filteredData) => {
    // Avoid filter for empty string
    if (selectedMaterialName == "All") {
      return filteredData;
    }

    const filteredMaterialName = filteredData.filter(
      (sanc) => sanc.material_name == selectedMaterialName
    );
    return filteredMaterialName;
  };

  useEffect(() => {
    // Apply filters directly to purchaseData
    let filteredData = purchaseData;
    filteredData=filterByMaterialName(filteredData);
    filteredData = filterByDate(filteredData);

    
    setmaterialWisePrice(
      filteredData.reduce((acc, purchase) => {
        acc["Total Price"] = acc["Total Price"] || 0;
        acc["Total Price"] += purchase.price * purchase.quantity_purchased;
        
        acc[purchase.material] = acc[purchase.material] || 0;
        acc[purchase.material] += purchase.price * purchase.quantity_purchased;
        return acc;
      }, {})
      );
      setFilteredList(filteredData);
      const newData = filteredData.filter((user) => {
        
        if (search && !user.vendor_details.toLowerCase().includes(search.toLowerCase())) {
          return false;
        }
        
        // if (search && user.ticket_id.toString() !== search.toString()) {
        //   return false;
        // }
  
        return true;
      });
  
      setFilteredList(newData);
  }, [startDate, endDate,selectedMaterialName,search]);

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };
  return (
    <div className="overflow-x-auto">
      <div className="container mx-auto px-4 bg-[#FFFEFA] sm:px-8 my-5">
        <div className="py-4">
          <div>
            <h2 className="text-2xl font-semibold leading-tight">Purchases</h2>
          </div>
          <div className="relative dates flex">
            <div>
              <label>Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="py-1 px-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 m-2"
                style={{ width: "150px" }}
              />
            </div>
            <div className="ml-4">
              <label>End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="py-1 px-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 m-2"
                style={{ width: "150px" }}
              />
            </div>
          </div>
          <div className="flex flex-wrap filters">
            <div className="relative selectMaterials mr-2 my-3">
              <SearchableDropdown
                options={contextData.materialsData}
                label="material_name"
                id="id"
                selectedVal={selectedMaterialName}
                handleChange={(val) => setSelectedMaterialName(val)}
                allLabel="All Materials"
                display="Select Material"
              />
            </div>

           

            <div className="relative eng mr-2 my-3"></div>
            {/* Status Dropdown */}
            
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
                placeholder="Search by Vendor Name"
                className="appearance-none rounded-r rounded-l sm:rounded-l-none border border-gray-400 border-b block pl-8 pr-6 py-2 w-full bg-white text-sm placeholder-gray-400 text-gray-700 focus:bg-white focus:placeholder-gray-600 focus:text-gray-700 focus:outline-none"
              />
            </div>
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
          <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
            <div className="inline-block min-w-full shadow overflow-hidden">
            <div className="bg-white -mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto ">
            <div className="inline-block min-w-full shadow overflow-hidden">
              <table className="min-w-full leading-normal bg-white">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Purchase ID
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Material
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Quantity Purchased
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Purchase Type
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Vendor Details
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Invoice PDF
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentEntries.map((purchase) => (
                    <tr key={purchase.purchase_id}>
                      <td className="px-5 py-4 border-b border-gray-200 text-sm">
                        {purchase.purchase_id}
                      </td>
                      <td className="px-5 py-4 border-b border-gray-200 text-sm">
                        {purchase.material_name}
                      </td>
                      <td className="px-5 py-4 border-b border-gray-200 text-sm">
                        {purchase.quantity_purchased}
                      </td>
                      <td className="px-5 py-4 border-b border-gray-200 text-sm">
                        {purchase.purchase_type}
                      </td>
                      <td className="px-5 py-4 border-b border-gray-200 text-sm">
                        {purchase.vendor_details}
                      </td>
                      <td className="px-5 py-4 border-b border-gray-200 text-sm">
                        {new Date(purchase.date_time).toLocaleString()}
                      </td>
                      <td className="px-5 py-4 border-b border-gray-200 text-sm">
                        <Link to={`purchase_pdf/${purchase.purchase_id}`}>
                          <button className="bg-[#3c50e0] hover:bg-[#6272e6] text-white font-medium py-2 px-4 rounded">
                            VIEW PDF
                          </button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
              </div>
              <div className="px-5 bg-[#FFFEFA] border-t flex flex-col xs:flex-row items-center xs:justify-between">
                <span className="text-xs xs:text-sm text-gray-900">
                  {/* Showing 1 to {Math.min(filteredList.length, perPage)} of{" "}
                  {filteredList.length} Entries */}

                  Showing {indexOfFirstEntry+1} to  {Math.min(filteredList.length, indexOfLastEntry)} of{" "}
                  {filteredList.length} Entries
                </span>
                <div className="inline-flex mt-2 xs:mt-0">
                  {/* <button className="text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-l">
                Prev
              </button>
              <button className="text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-r">
                Next
              </button> */}
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
                    disabled={indexOfLastEntry >= filteredList.length}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <h1 className="text-xl font-bold mb-2">Material-wise Prices:</h1>
          <div className="inline-block min-w-full shadow overflow-hidden">
            <table className="min-w-full leading-normal bg-white">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    MATERIAL
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    PRICE
                  </th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(materialWisePrice).map(
                  ([material, price]) =>
                    material !== "Total Price" && (
                      <tr key={material} className="border-b border-gray-300">
                        <td className="px-5 py-4 border-b border-gray-200 text-sm">
                          {material}
                        </td>
                        <td className="px-5 py-4 border-b border-gray-200 text-sm">
                          {price}
                        </td>
                      </tr>
                    )
                )}
                <tr className="border-b border-gray-300">
                  <td className="px-5 py-4 border-b border-gray-200 text-sm font-semibold">
                    Total Price
                  </td>
                  <td className="px-5 py-4 border-b border-gray-200 text-sm font-semibold">
                    {materialWisePrice["Total Price"]}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        {/* Pagination */}
      </div>
    </div>
  );
};

export default PurchaseTable;
