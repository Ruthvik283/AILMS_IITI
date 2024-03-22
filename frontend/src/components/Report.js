import React, { useState, useEffect, useContext } from "react";
import { MultiSelect } from "primereact/multiselect";
import AuthContext from "../context/AuthContext";
import MaterialGraph from "./Graph";
import SanctionGraph from "./SanctionGraph";
import MaterialPieChart from "./piechart";

import "primereact/resources/themes/lara-light-cyan/theme.css";
import Purchase from "../pages/Purchase";

export default function Report() {
  const contextData = useContext(AuthContext);
  // collect all the datas

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
        console.log("fetched_department_data", data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const [purchaseData, setPurchaseData] = useState([]);
  const [startDate, setStartDate] = useState("NULL");
  const [endDate, setEndDate] = useState("NULL");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/purchases/${startDate}/${endDate}/`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setPurchaseData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [startDate, endDate]);

  const fields = [
    { name: "Purchase", code: "NY" },
    { name: "Sanction", code: "RM" },
  ];

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value || "NULL");
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value || "NULL");
  };

  //for the filtering
  const [selectedMaterials, setSelectedMaterials] = useState(null);
  const [selectedFields, setSelectedFields] = useState(null);
  const [selectedDepartments, setSelectedDepartments] = useState(null);

  const [selectedShowSubDepartments, setSelectedShowSubDepartments] =
    useState(null);
  const [selectedSubDepartments, setSelectedSubDepartments] = useState(null);

  const [filteredSanctionList, setFilteredSanctionList] = useState([]);
  const [filteredPurchaseList, setFilteredPurchaseList] = useState([]);

  const filterSanctionData = () => {
    if (!selectedMaterials) {
      return;
    }

    let filteredData = [...sanctionData]; // Create a copy of the original data

    filteredData = filteredData.filter((sanction) => {
      return selectedMaterials.some(
        (mat) => mat.material_name === sanction.material_name
      );
    });

    setFilteredSanctionList(filteredData);
  };

  const filterPurchaseData = () => {
    if (!selectedMaterials) {
      return;
    }

    let filteredData = [...purchaseData]; // Create a copy of the original data

    filteredData = filteredData.filter((sanction) => {
      return selectedMaterials.some(
        (mat) => mat.material_name === sanction.material_name
      );
    });

    setFilteredPurchaseList(filteredData);
  };

  const [showSanctionTable, setShowSanctionTable] = useState(false);
  const [showPurchaseTable, setShowPurchaseTable] = useState(false);

  //analysis calculationss

  const materialPurchaseWisePrice = filteredPurchaseList.reduce(
    (acc, purchase) => {
      acc["Total Price"] = acc["Total Price"] || 0;
      acc["Total Price"] += purchase.price * purchase.quantity_purchased;

      acc[purchase.material_name] = acc[purchase.material_name] || 0;
      acc[purchase.material_name] +=
        purchase.price * purchase.quantity_purchased;
      return acc;
    },
    {}
  );

  const materialSanctionWisePrice = filteredSanctionList.reduce(
    (acc, purchase) => {
      acc["Total Price"] = acc["Total Price"] || 0;
      acc["Total Price"] += purchase.price * purchase.quantity_sanctioned;

      acc[purchase.material_name] = acc[purchase.material_name] || 0;
      acc[purchase.material_name] +=
        purchase.price * purchase.quantity_sanctioned;
      return acc;
    },
    {}
  );

  useEffect(() => {
    setSelectedShowSubDepartments(null);
    const subDepartments = departmentData
      .filter((department) => selectedDepartments.includes(department))
      .map((department) => department.sub_departments)
      .flat();
    setSelectedShowSubDepartments(subDepartments);
  }, [selectedDepartments]);

  const handleDepartmentChange = (e) => {
    setSelectedDepartments(e.value);
    setSelectedSubDepartments([]); // Resetting selected sub-departments
  };
  console.log(selectedDepartments);

  return (
    <>
      <div className="FILTERS">
        <div className="mx-60 my-5 w-1/4">
          <div className="card flex justify-content-center my-10">
            <MultiSelect
              value={selectedDepartments}
              onChange={handleDepartmentChange}
              options={departmentData}
              optionLabel="department_name"
              placeholder="Select Department"
              maxSelectedLabels={3}
              className="w-full md:w-20rem"
            />
          </div>
          <div className="card flex justify-content-center my-10">
            <MultiSelect
              value={selectedSubDepartments}
              onChange={(e) => setSelectedSubDepartments(e.value)}
              options={selectedShowSubDepartments}
              optionLabel="department_name"
              placeholder="Select Sub Department"
              maxSelectedLabels={3}
              className="w-full md:w-20rem"
            />
          </div>
          <div className="card flex justify-content-center my-10">
            <MultiSelect
              value={selectedMaterials}
              onChange={(e) => setSelectedMaterials(e.value)}
              options={contextData.materialsData}
              optionLabel="material_name"
              placeholder="Select Materials"
              maxSelectedLabels={3}
              className="w-full md:w-20rem"
            />
          </div>
          <div className="card flex justify-content-center my-10">
            <MultiSelect
              value={selectedFields}
              onChange={(e) => setSelectedFields(e.value)}
              options={fields}
              optionLabel="name"
              placeholder="Select Fields"
              maxSelectedLabels={3}
              className="w-full md:w-20rem"
            />
          </div>
          <div>
            <input
              className="px-5"
              type="date"
              onChange={handleStartDateChange}
            />
            <input
              className="px-5"
              type="date"
              onChange={handleEndDateChange}
            />
          </div>
          <div className="flex justify-center items-center py-10">
            <div className="flex justify-center items-center py-10">
              <button
                type="button"
                className="inline-block rounded bg-neutral-100 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-neutral-600 shadow-light-3 transition duration-150 ease-in-out hover:bg-neutral-200 hover:shadow-light-2 focus:bg-neutral-200 focus:shadow-light-2 focus:outline-none focus:ring-0 active:bg-neutral-200 active:shadow-light-2 motion-reduce:transition-none dark:shadow-black/30 dark:hover:shadow-dark-strong dark:focus:shadow-dark-strong dark:active:shadow-dark-strong"
                onClick={() => {
                  if (
                    selectedFields &&
                    selectedFields.some((obj) => obj.name.includes("Sanction"))
                  ) {
                    setShowSanctionTable(true);
                    filterSanctionData();
                  } else {
                    setShowSanctionTable(false);
                  }

                  if (
                    selectedFields &&
                    selectedFields.some((obj) => obj.name.includes("Purchase"))
                  ) {
                    setShowPurchaseTable(true);
                    filterPurchaseData();
                  } else {
                    setShowPurchaseTable(false);
                  }
                }}
              >
                FILTER
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="TABLES">
        <div className="mx-20 my-10">
          {showSanctionTable && (
            <div className="mx-20 my-10">
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
                    {filteredSanctionList.map((sanction) => (
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
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <table className="table-auto w-full border-collapse border border-gray-400">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="px-4 py-2 text-left">Material</th>
                    <th className="px-4 py-2 text-left">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(materialSanctionWisePrice).map(
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
          )}

          {showPurchaseTable && (
            <div className="mx-20 my-10">
              <h2 className="text-xl font-bold mb-4">Purchase List</h2>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Purchase ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Material
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity Purchased
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vendor Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date & Time
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPurchaseList.map((purchase) => (
                    <tr key={purchase.purchase_id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {purchase.purchase_id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {purchase.material_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {purchase.quantity_purchased}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {purchase.vendor_details}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(purchase.date_time).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <table className="table-auto w-full border-collapse border border-gray-400">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="px-4 py-2 text-left">Material</th>
                    <th className="px-4 py-2 text-left">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(materialPurchaseWisePrice).map(
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
          )}

          <div className="flex flex-center justify-content-center align-items-center">
            <button
              type="button"
              class="inline-block rounded bg-neutral-100 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-neutral-600 shadow-light-3 transition duration-150 ease-in-out hover:bg-neutral-200 hover:shadow-light-2 focus:bg-neutral-200 focus:shadow-light-2 focus:outline-none focus:ring-0 active:bg-neutral-200 active:shadow-light-2 motion-reduce:transition-none dark:shadow-black/30 dark:hover:shadow-dark-strong dark:focus:shadow-dark-strong dark:active:shadow-dark-strong"
            >
              GENERATE REPORT
            </button>
          </div>
          {/* <button onClick={filterByMaterialName()}></button> */}
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-4 py-4">
        <div className="text-center">
          <h3 className="text-lg font-bold mb-2">Material Graph</h3>
          <MaterialGraph data={filteredSanctionList} />
          <SanctionGraph data={filteredSanctionList} />
        </div>
        <div className="text-center">
                  <MaterialPieChart data={filteredSanctionList} />
        </div>
      </div>
    </>
  );
}
