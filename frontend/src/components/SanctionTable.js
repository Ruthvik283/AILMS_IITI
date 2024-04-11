import React from "react";
import { useEffect, useState, useContext } from "react";
import { BiChevronDown } from "react-icons/bi";
import { AiOutlineSearch } from "react-icons/ai";
import MaterialGraph from "./Graph";
import MaterialPieChartSanction from "./MaterialPieChartSanction";
import AuthContext from "../context/AuthContext";
import SanctionGraph from "./SanctionGraph";
import SearchableDropdown from "./SearchableDropdown";
import DescriptionCard from "./DecriptionCard";

const SanctionTable = () => {
  //fectching the data
  //   const [materialsData, setMaterialsData] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const contextData = useContext(AuthContext);
  const [sanctionData, setSanctionData] = useState([]);
  const [engineerData, setEngineerData] = useState([]);
  const [engineerDisplayData, setEngineerDisplayData] = useState([]);
  let [materialWisePrice, setmaterialWisePrice] = useState([]);
  const [departmentUsers, setDepartmentUsers] = useState({});
  const [isTicketIdZero, setIsTicketIdZero] = useState("All");
  const [isOpen, setIsOpen] = useState(false);
  const [DescriptionContent, setDescriptionContent] = useState("");


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/sanctions/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(contextData.userData),
        });
        //console.log("rrr", contextData.userData);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setSanctionData(data);
        setmaterialWisePrice(
          data.reduce((acc, purchase) => {
            acc["Total Price"] = acc["Total Price"] || 0;
            acc["Total Price"] += purchase.price * purchase.quantity_sanctioned;

            acc[purchase.material_name] = acc[purchase.material_name] || 0;
            acc[purchase.material_name] +=
              purchase.price * purchase.quantity_sanctioned;
            return acc;
          }, {})
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const [departmentData, setDepartmentData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/departments", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setDepartmentData(data);
        //console.log(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
    setDepartmentUsers(departmentData.reduce((acc, department) => acc.concat(department.users), []));

  }, []);


  const [technicianData, setTechnicianData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/technicians/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setTechnicianData(data);
        //console.log(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);




  useEffect(() => {
    setFilteredList(sanctionData);
  }, [sanctionData]);

  // List of all samctions satisfying all the filters
  const [filteredList, setFilteredList] = useState(sanctionData);

  // Selected MaterialName name filter
  const [selectedDepartmentName, setSelectedDepartmentName] = useState("All");
  const [selectedTechnicianName, setSelectedTechnicianName] = useState("All");
  const [selectedMaterialName, setSelectedMaterialName] = useState("All");

  const [selectedEngineerName, setSelectedEngineerName] = useState("All");



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


  const filterByEngineerName = (filteredData) => {
    // Avoid filter for empty string
    if (selectedEngineerName == "All") {
      return filteredData;
    }

    const filteredEngineerName = filteredData.filter(
      (sanc) => sanc.username == selectedEngineerName
    );
    return filteredEngineerName;
  };

  const filterByTechicianName = (filteredData) => {
    // Avoid filter for empty string
    if (selectedTechnicianName == "All") {
      return filteredData;
    }

    const filteredTechnicianName = filteredData.filter(
      (sanc) => sanc.technician_name == selectedTechnicianName
    );
    return filteredTechnicianName;
  };

  const filterByDepartmentName = (filteredData) => {
    // Avoid filtering for empty string
    if (selectedDepartmentName == "All") {
      return filteredData;
    }

    const filteredDataWithDepartmentNames = filteredData.filter(
      (sanc) => sanc.department_name == selectedDepartmentName
    );

    return filteredDataWithDepartmentNames;
  };

  // const filterByEngineerName = (filteredData) => {
  //   // Avoid filtering for empty string
  //   if (!selectedEngineerName) {
  //     return filteredData;
  //   }

  //   const filteredDataWithEngineerNames = filteredData.filter(
  //     (sanc) => sanc.engineer_name == selectedEngineerName
  //   );
  //   // //console.log(departmentIdToNameMap);
  //   // //console.log(filteredData);
  //   return filteredDataWithEngineerNames;
  // };


  const filterByDate = (filteredData) => {
    let filteredByDate = filteredData;

    // If start date is null, set it to the earliest possible date
    const startDateFilter = startDate ? new Date(startDate) : new Date(0);

    // If end date is null, set it to the current date
    const endDateFilter = endDate ? new Date(endDate) : new Date();
    const nextDayDate = endDateFilter;
    nextDayDate.setDate(nextDayDate.getDate() + 1);
    //endDate.setendDate(endDate.getDate() + 1);
    ////console.log(startDateFilter, endDateFilter);

    filteredByDate = filteredData.filter(
      (purchase) =>
        new Date(purchase.date_time) >= startDateFilter &&
        new Date(purchase.date_time) < nextDayDate
    );

    return filteredByDate;
  };

  const filterByTicketIdZero = (filteredData) => {
    // Avoid filtering for "All" value
    if (isTicketIdZero === "All") {
      return filteredData;
    }

    const isZero = isTicketIdZero === "Zero";

    const filteredTicketIdZero = filteredData.filter(
      (sanc) => (isZero ? sanc.ticket_id === 0 : sanc.ticket_id !== 0)
    );
    return filteredTicketIdZero;
  };

  const fetchDescriptionContent = async (sanctionId) => {
    try {
      const response = await fetch(`/api/sanctions/${sanctionId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setDescriptionContent(data.description);
      setIsOpen(true);
    } catch (error) {
      console.error("Error fetching Description content:", error);
    }
  };

  const handleCloseDescriptionPopup = () => {
    setIsOpen(false);
    setDescriptionContent("");
  };

  // number of sanctions per page----------------------------------------------------------------------------
  const [perPage, setPerPage] = useState(5);
  const [status, setStatus] = useState("All");
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
  // ------------------------------------------------------------------------------------------------------------

  useEffect(() => {
    let filteredData = sanctionData;

    filteredData = filterByDepartmentName(filteredData, selectedDepartmentName, departmentData);
    filteredData = filterByMaterialName(filteredData, selectedMaterialName);
    filteredData = filterByEngineerName(filteredData, selectedEngineerName, departmentData);
    filteredData = filterByTechicianName(filteredData, selectedTechnicianName)
    filteredData = filterByDate(filteredData, startDate, endDate);
    filteredData = filterByTicketIdZero(filteredData);

    const newData = filteredData.filter((user) => {
      if (status !== "All" && user.closed !== (status === "Closed")) {
        return false;
      }
      if (search && !user.ticket_id.toString().startsWith(search.toString())) {
        return false;
      }

      // if (search && user.ticket_id.toString() !== search.toString()) {
      //   return false;
      // }

      return true;
    });

    setFilteredList(newData);
  }, [
    sanctionData,
    departmentData,
    selectedMaterialName,
    selectedDepartmentName,
    selectedEngineerName,
    startDate,
    endDate,
    search,
    status,
    selectedTechnicianName,
    isTicketIdZero,
  ]);

  // Now you can use this 'options' array wherever you need it in your code.

  return (
    <div className="overflow-x-auto">
      <div className="container mx-auto px-4 bg-[#FFFEFA] sm:px-8 my-5">
        <div className="py-4">
          <div>
            <h2 className="text-2xl font-semibold leading-tight">Sanctions</h2>
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

            <div className="relative dept mr-2 my-3">
              <SearchableDropdown
                options={departmentData}
                label="department_name"
                id="id"
                selectedVal={selectedDepartmentName}
                handleChange={(val) => setSelectedDepartmentName(val)}
                allLabel="All Departments"
              />
            </div>
            <div className="relative dept mr-2 my-3">
              <SearchableDropdown
                options={technicianData}
                label="technician_name"
                id="id"
                selectedVal={selectedTechnicianName}
                handleChange={(val) => setSelectedTechnicianName(val)}
                allLabel="All Technicians"
              />
            </div>

            <div className="relative eng mr-2 my-3"></div>
            {/* Status Dropdown */}
            <div className="relative open-close mr-2 my-3">
              <SearchableDropdown
                options={statusOptions}
                label="value"
                id="id"
                selectedVal={status}
                handleChange={(val) => setStatus(val)}
                allLabel="All Status"
              />
            </div>
            <div className="relative dept mr-2 my-3">
              <SearchableDropdown
                options={[{ value: "All" }, { value: "Zero" }, { value: "Non-Zero" }]}
                label="value"
                id="id"
                selectedVal={isTicketIdZero}
                handleChange={(val) => setIsTicketIdZero(val)}
                allLabel="All Ticket IDs"
              />
            </div>
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
                placeholder="Search by Ticket ID"
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
          {/* Table */}
          <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto ">
            <div className="inline-block min-w-full shadow overflow-hidden">
              <table className="min-w-full leading-normal bg-white">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Sanction ID
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Ticket ID
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Department
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Engineer Name
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Technician ID
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Material
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Quantity Sanctioned
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>

                    <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Modify Sanction
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentEntries.map((sanction) => (
                    <tr key={sanction.sanction_id}>
                      <td className="px-5 py-4 border-b border-gray-200 text-sm">
                        {sanction.sanction_id}
                      </td>
                      <td className="px-5 py-4 border-b border-gray-200 text-sm">
                        {sanction.ticket_id}
                      </td>
                      <td className="px-5 py-4 border-b border-gray-200 text-sm">
                        {sanction.department_name}
                      </td>
                      <td className="px-5 py-4 border-b border-gray-200 text-sm">
                        {sanction.engineer_name}
                      </td>
                      <td className="px-5 py-4 border-b border-gray-200 text-sm">
                        {sanction.technician_name}-{sanction.technician_id}
                      </td>
                      <td className="px-5 py-4 border-b border-gray-200 text-sm">
                        {sanction.material_name}
                      </td>
                      <td className="px-5 py-4 border-b border-gray-200 text-sm">
                        <button
                          onClick={() => fetchDescriptionContent(sanction.sanction_id)}
                          className="text-blue-500 hover:underline"
                        >
                          View
                        </button>                        
                      </td>
                      <td className="px-5 py-4 border-b border-gray-200 text-sm">
                        {new Date(sanction.date_time).toLocaleString()}
                      </td>
                      <td className="px-5 py-4 border-b border-gray-200 text-sm">
                        {sanction.quantity_sanctioned}
                      </td>
                      <td className="px-5 py-4 border-b border-gray-200 text-sm">
                        <span className="relative inline-block px-3 py-1 font-semibold leading-tight">
                          <span
                            className={`absolute inset-0 ${sanction.closed ? "bg-red-200" : "bg-green-200"
                              } opacity-50 rounded-full`}
                          ></span>
                          <span
                            className={`relative ${sanction.closed
                              ? "text-red-900"
                              : "text-green-900"
                              }`}
                          >
                            {sanction.closed ? "Closed" : "Open"}
                          </span>
                        </span>{" "}
                      </td>
                      <td className="px-5 py-4 border-b border-gray-200 text-sm">
                        {/* <button className="bg-sky-500 hover:bg-sky-700 text-white font-small py-2 px-4 rounded"> */}
                        <a href={`modifysanction/${sanction.sanction_id}`}>
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                        </a>
                        {/* </button> */}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {/* Pagination */}
          <div className="px-5 bg-[#FFFEFA] border-t flex flex-col xs:flex-row items-center xs:justify-between">
            <span className="text-xs xs:text-sm text-gray-900">
              {/* Showing 1 to {Math.min(filteredList.length, perPage)} of{" "}
              {filteredList.length} Entries */}
              Showing {indexOfFirstEntry + 1} to  {Math.min(filteredList.length, indexOfLastEntry)} of{" "}
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
      {isOpen && (
        <DescriptionCard
          matterContent={DescriptionContent}
          onClose={handleCloseDescriptionPopup}
        />
      )}
    </div>
  );
};

export default SanctionTable;
