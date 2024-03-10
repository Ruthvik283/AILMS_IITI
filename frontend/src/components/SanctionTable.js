import React from "react";
import { useEffect, useState } from "react";

const SanctionTable = () => {
  //fectching the data
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

  const materialWisePrice = sanctionData.reduce((acc, purchase) => {
    acc["Total Price"] = acc["Total Price"] || 0;
    acc["Total Price"] += purchase.price * purchase.quantity_sanctioned;

    acc[purchase.material_name] = acc[purchase.material_name] || 0;
    acc[purchase.material_name] +=
      purchase.price * purchase.quantity_sanctioned;
    return acc;
  }, {});






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
  
    // Set the filtered data to the filteredList state
    setFilteredList(filteredData);
  }, [selectedMaterialName, selectedDepartmentName]);
  

  const [input, setInput] = useState("");
  const [results, setResults] = useState([]);

  const handleChange = (value) => {
    setInput(value);
    const filteredResults = departmentData.filter((name) =>
      name.department_name.toLowerCase().includes(value.toLowerCase())
    );
    setResults(filteredResults);
  };

  return (
    <div>
      <div className="input-wrapper">
        <input
          placeholder="Type to search..."
          value={input}
          onChange={(e) => handleChange(e.target.value)}
        />
      </div>
      <div className="results-list">
        <div
          className="search-result"
          onClick={() => handleDepartmentNameChange("")}
        >
          All
        </div>
        {results.map((result, id) => (
          <div
            className="search-result"
            onClick={() => handleDepartmentNameChange(result.department_name)}
            key={id}
          >
            {result.department_name}
          </div>
        ))}
      </div>

      <div className="MaterialName-filter">
        <div>Filter by MaterialName :</div>
        <select
          id="MaterialName-input"
          value={selectedMaterialName}
          onChange={(e) => handleMaterialNameChange(e)}
        >
          <option value="">All</option>
          {materialsData.map((material, index) => (
            <option key={index} value={material.name}>
              {material.material_name}
            </option>
          ))}
        </select>
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
