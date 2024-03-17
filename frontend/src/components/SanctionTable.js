import React from "react";
import { useEffect, useState, useContext } from "react";
import { BiChevronDown } from "react-icons/bi";
import { AiOutlineSearch } from "react-icons/ai";
import MaterialGraph from "./Graph";
import MaterialPieChart from "./piechart";
import AuthContext from "../context/AuthContext";

const SanctionTable = () => {
  //fectching the data
//   const [materialsData, setMaterialsData] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const contextData = useContext(AuthContext);

  const [sanctionData, setSanctionData] = useState([]);
  let [materialWisePrice, setmaterialWisePrice] = useState([]);

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
        const response = await fetch("http://127.0.0.1:8000/api/departments", {
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
        console.log(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    setFilteredList(sanctionData);
  }, [sanctionData]);

  // List of all cars satisfing all the filters
  const [filteredList, setFilteredList] = useState(sanctionData);

  // Selected MaterialName name filter
  const [selectedMaterialName, setSelectedMaterialName] = useState("");
  const [selectedDepartmentName, setSelectedDepartmentName] = useState("");

  const filterByMaterialName = (filteredData) => {
    // Avoid filter for empty string
    if (!selectedMaterialName) {
      return filteredList;
    }

    const filteredMaterialName = filteredData.filter(
      (car) => car.material_name == selectedMaterialName
    );
    return filteredMaterialName;
  };

  const filterByDepartmentName = (filteredData, departmentData) => {
    // Avoid filtering for empty string
    if (!selectedDepartmentName) {
      return filteredData;
    }

    // Create a mapping of department_id to department_name from departmentData
    const departmentIdToNameMap = {};
    departmentData.map((dept) => {
      departmentIdToNameMap[dept.department_id] = dept.department_name;
    });

    const filteredDataWithDepartmentNames = filteredData.filter(
      (car) => departmentIdToNameMap[car.department] == selectedDepartmentName
    );
    console.log(departmentIdToNameMap);
    console.log(filteredData);

    return filteredDataWithDepartmentNames;
  };

  const filterByDate = (filteredData) => {
    let filteredByDate = filteredData;

    // If start date is null, set it to the earliest possible date
    const startDateFilter = startDate ? new Date(startDate) : new Date(0);

    // If end date is null, set it to the current date
    const endDateFilter = endDate ? new Date(endDate) : new Date();

    filteredByDate = filteredData.filter(
      (sanction) =>
        new Date(sanction.date_time) >= startDateFilter &&
        new Date(sanction.date_time) <= endDateFilter
    );

    return filteredByDate;
  };

  // const handleMaterialNameChange = (event) => {
  //   setSelectedMaterialName(event.target.value);

  // };

  const handleMaterialNameChange = (event) => {
    const selectedValue = event.target.value;

    // If the user selects "All", reset the selectedMaterialName to an empty string
    if (selectedValue === "") {
      setSelectedMaterialName("");
      return;
    }

    // Otherwise, update the selectedMaterialName with the selected value
    setSelectedMaterialName(selectedValue);
  };
  const handleDepartmentNameChange = (departmentName) => {
    if (departmentName === "") {
      setSelectedDepartmentName("");
      return;
    }
    setSelectedDepartmentName(departmentName);
  };

  // useEffect(() => {
  //   setFilteredList(sanctionData);
  //   var filteredData = filterByMaterialName(filteredList);
  //   filteredData = filterByDepartmentName(filteredData, departmentData);
  //   setFilteredList(filteredData);
  // }, [selectedMaterialName, selectedDepartmentName]);

  useEffect(() => {
    // Apply filters directly to sanctionData
    let filteredData = sanctionData;

    if (selectedMaterialName) {
      filteredData = filterByMaterialName(filteredData);
    }

    if (selectedDepartmentName) {
      filteredData = filterByDepartmentName(filteredData, departmentData);
    }

    filteredData = filterByDate(filteredData);
    console.log("filteredData", filteredData);

    setmaterialWisePrice(
      filteredData.reduce((acc, purchase) => {
        acc["Total Price"] = acc["Total Price"] || 0;
        acc["Total Price"] += purchase.price * purchase.quantity_sanctioned;

        acc[purchase.material_name] = acc[purchase.material_name] || 0;
        acc[purchase.material_name] +=
          purchase.price * purchase.quantity_sanctioned;
        return acc;
      }, {})
    );

    // Set the filtered data to the filteredList state
    setFilteredList(filteredData);
  }, [selectedMaterialName, selectedDepartmentName, startDate, endDate]);

  // const [input, setInput] = useState("");
  // const [results, setResults] = useState([]);

  // const handleChange = (value) => {
  //   setInput(value);
  //   const filteredResults = departmentData.filter((name) =>
  //     name.department_name.toLowerCase().includes(value.toLowerCase())
  //   );
  //   setResults(filteredResults);
  // };

  const [inputValue, setInputValue] = useState("");
  const [selected, setSelected] = useState("All");
  const [open, setOpen] = useState(false);

  return (
    <div>
      <div className="flex items-left flex-col px-10 py-1">
        <div>Select Start Date</div>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="py-1 px-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        />
      </div>

      <div className="flex items-left flex-col px-10 py-1">
        <div>Select End Date</div>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="py-1 px-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        />
      </div>
      <div className="px-10 py-10 mx-10 my-10 border border-gray-400">
        <div class="flex items-left flex-col px-10 py-1">
          <div>Select Material</div>
          <div className="w-full">
            <select
              id="MaterialName-input"
              value={selectedMaterialName}
              onChange={(e) => handleMaterialNameChange(e)}
              class="py-1 px-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="">All</option>
              {contextData.materialsData.map((material, index) => (
                <option key={index} value={material.name}>
                  {material.material_name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div class="flex items-left flex-col px-10 py-1">
          <div>Select Department</div>
          <div class="w-full">
            <div
              onClick={() => setOpen(!open)}
              class={`bg-white p-2 flex items-center justify-between rounded ${
                !selected && "text-gray-700"
              }`}
            >
              {selected
                ? selected?.length > 25
                  ? selected?.substring(0, 25) + "..."
                  : selected
                : "Select Department"}
              <BiChevronDown size={20} class={`${open && "rotate-180"}`} />
            </div>
            <ul
              class={`bg-white mt-2 overflow-y-auto ${
                open ? "max-h-60" : "max-h-0"
              } `}
            >
              <div class="flex items-center px-2 sticky top-0 bg-white">
                <AiOutlineSearch size={18} class="text-gray-700" />
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value.toLowerCase())}
                  placeholder="Enter department name"
                  class="placeholder:text-gray-700 p-2 outline-none w-full"
                />
              </div>
              {/* Add the 'All' option */}
              <li
                key="all"
                class={`p-2 text-sm hover:bg-sky-600 hover:text-white
                                    ${!selected && "bg-sky-600 text-white"}
                                    ${
                                      selected === "All" &&
                                      "bg-sky-600 text-white"
                                    }
                                `}
                onClick={() => {
                  setSelected("All");
                  setOpen(false);
                  setInputValue("");
                  handleDepartmentNameChange("");
                }}
              >
                All
              </li>
              {/* Map other department data */}
              {departmentData?.map((dept) => (
                <li
                  key={dept?.department_id}
                  class={`p-2 text-sm hover:bg-sky-600 hover:text-white
                                    ${
                                      dept?.department_name?.toLowerCase() ===
                                        selected?.toLowerCase() &&
                                      "bg-sky-600 text-white"
                                    }
                                    ${
                                      dept?.department_name
                                        ?.toLowerCase()
                                        .startsWith(inputValue)
                                        ? "block"
                                        : "hidden"
                                    }`}
                  onClick={() => {
                    if (
                      dept?.department_name?.toLowerCase() !==
                      selected.toLowerCase()
                    ) {
                      setSelected(dept?.department_name);
                      setOpen(false);
                      setInputValue("");
                      handleDepartmentNameChange(dept?.department_name);
                    }
                  }}
                >
                  {dept?.department_name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

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
          {filteredList.map((sanction) => (
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
                {sanction.material_name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {new Date(sanction.date_time).toLocaleString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {sanction.quantity_sanctioned}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <a href={`modifysanction\\${sanction.sanction_id}`}>
                  MODIFY SANCTION
                </a>
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
      <div className="container">
        <h1 className=" text-center">Materials Graph</h1>
        <MaterialGraph data={sanctionData} />
      </div>
      <div className="container">
        <MaterialPieChart data={sanctionData} />
      </div>
    </div>
  );
};

export default SanctionTable;
