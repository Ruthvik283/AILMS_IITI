import React, { useState, useEffect, useContext } from "react";
import { MultiSelect } from "primereact/multiselect";
import AuthContext from "../context/AuthContext";
import MaterialGraph from "./Graph";
import SanctionGraph from "./SanctionGraph";
import MaterialPieChartSanction from "./MaterialPieChartSanction";
import { Link } from "react-router-dom";
import "./Report.css";

import "primereact/resources/themes/lara-light-cyan/theme.css";
import Purchase from "../pages/Purchase";
import MaterialPieChartPurchase from "./MaterialPieChartPurchase";
import PricePieChartSanction from "./PricePieChartSanction";

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
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [selectedFields, setSelectedFields] = useState([]);
  const [selectedDepartments, setSelectedDepartments] = useState([]);

  const [selectedShowSubDepartments, setSelectedShowSubDepartments] = useState(
    []
  );
  const [selectedSubDepartments, setSelectedSubDepartments] = useState([]);

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

  const [showReport, setShowReport] = useState(false);

  return (
    <>
      <div className="FILTERS bg-white my-10 rounded shadow-md">
        <div className="px-10 py-5">
          Please select the fields you wish to include in the report.
        </div>
        <hr class="border-t border-gray-300 mx-10" />

        <div className="ml-20 mr-10 my-5">
          <div className="card flex justify-content-center my-5">
            <MultiSelect
              value={selectedDepartments}
              onChange={handleDepartmentChange}
              options={departmentData.filter(
                (department) => (department.is_main === true)
              )}
              optionLabel="department_name"
              placeholder="Select Department"
              maxSelectedLabels={5}
              className="w-full md:w-20rem border border-gray-100"
            />
          </div>
          <div className="card flex justify-content-center my-5">
            <MultiSelect
              value={selectedSubDepartments}
              onChange={(e) => setSelectedSubDepartments(e.value)}
              options={selectedShowSubDepartments}
              optionLabel="department_name"
              placeholder="Select Sub Department"
              maxSelectedLabels={10}
              className="w-full md:w-20rem border border-gray-100"
            />
          </div>
          <div className="card flex justify-content-center my-5">
            <MultiSelect
              value={selectedMaterials}
              onChange={(e) => setSelectedMaterials(e.value)}
              options={contextData.materialsData}
              optionLabel="material_name"
              placeholder="Select Materials"
              maxSelectedLabels={20}
              className="w-full md:w-20rem border border-gray-100"
            />
          </div>
          <div className="card flex justify-content-center my-5">
            <MultiSelect
              value={selectedFields}
              onChange={(e) => setSelectedFields(e.value)}
              options={fields}
              optionLabel="name"
              placeholder="Select Fields"
              maxSelectedLabels={10}
              className="w-full md:w-20rem border border-gray-100"
            />
          </div>
          <div className="DATE flex flex-wrap">
            <div>
              <label className="text-gray-700">Start Date: </label>
              <input
                className="px-5 py-3 border border-gray-100 rounded mr-10 text-gray-500"
                type="date"
                onChange={handleStartDateChange}
              />
            </div>
            <div>
              <label className="text-gray-700">End Date: </label>
              <input
                className="px-5 py-3 border border-gray-100 rounded text-gray-500"
                type="date"
                onChange={handleEndDateChange}
              />
            </div>
          </div>
          <div className="flex justify-center items-center py-5">
            <button
              type="button"
              onClick={() => {
                setShowReport(true);
                filterSanctionData();
                filterPurchaseData();
              }}
              className="flex-1 font-bold text-xl bg-white px-6 py-3 rounded-xl w-full button-48"
            >
              <span className="text">GENERATE REPORT</span>
            </button>
            {/* </div> */}
          </div>
        </div>
        {/* <hr class="border-t border-gray-300 w-full" /> */}
      </div>

      {showReport && (
        <div className="REPORT_RESULTS justify-center items-center py-20 mx-10">
          <div className="SANCTION_REPORT shadow-inner bg-[#ffffff] p-10 rounded mx-5 my-5">
            <h1 className="text-3xl font-bold text-left pb-5">
              Sanction Report
            </h1>
            <hr class="border-t border-gray-150" />

            <div className="Stats w-full flex flex-wrap">
              <div className="bg-gray-200 p-4 m-2 flex-1">
                <header className="font-bold mb-2">Number of Sanctions</header>
                <p className="text-lg">234</p>
              </div>
              <div className="bg-gray-200 p-4 m-2 flex-1">
                <header className="font-bold mb-2">
                  Prize worth of Sanctions
                </header>
                <p className="text-lg">$10 million</p>
              </div>
              <div className="bg-gray-200 p-4 m-2 flex-1">
                <header className="font-bold mb-2">
                  Prize worth of Sanctions
                </header>
                <p className="text-lg">$10 million</p>
              </div>
            </div>
            <div className="Graphical Stats my-10">
              <div class="flex flex-row flex-wrap justify-around">
                <MaterialPieChartSanction data={filteredSanctionList} />
                <PricePieChartSanction data={filteredSanctionList} />
                <SanctionGraph data={filteredSanctionList} />
              </div>
            </div>
            <div className="SANCTION_TABLE">
              <table className="w-full leading-normal table-auto border rounded-lg">
                <caption class="caption-bottom">Table : Sanctions</caption>
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-white uppercase tracking-wider bg-[#c8d8e4] ">
                      Sanction ID
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-white uppercase tracking-wider bg-[#c8d8e4] ">
                      Ticket ID
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-white uppercase tracking-wider bg-[#c8d8e4] ">
                      Department
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-white uppercase tracking-wider bg-[#c8d8e4] ">
                      Engineer ID
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-white uppercase tracking-wider bg-[#c8d8e4] ">
                      Technician ID
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-white uppercase tracking-wider bg-[#c8d8e4] ">
                      Material
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-white uppercase tracking-wider bg-[#c8d8e4] ">
                      Date and Time
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-white uppercase tracking-wider bg-[#c8d8e4] ">
                      Quantity Sanctioned
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredSanctionList.map((sanction) => (
                    <tr key={sanction.sanction_id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 whitespace-nowrap">
                        {sanction.sanction_id}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {sanction.ticket_id}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {sanction.department}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {sanction.engineer_id}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {sanction.technician_id}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {sanction.material}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {new Date(sanction.date_time).toLocaleString()}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {sanction.quantity_sanctioned}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="Materialwisesanction my-20">
              <table className="w-full leading-normal table-auto border rounded-lg">
                <caption class="caption-bottom">
                  Table : Materials Wise Sanction Cost
                </caption>
                <thead>
                  <tr className="bg-[#c8d8e4]">
                    <th className="px-4 py-2 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Material
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Price
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {Object.entries(materialSanctionWisePrice).map(
                    ([material, price]) =>
                      material !== "Total Price" && (
                        <tr key={material} className="hover:bg-gray-50">
                          <td className="px-4 py-2 whitespace-nowrap">
                            {material}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap">
                            {price}
                          </td>
                        </tr>
                      )
                  )}
                </tbody>
              </table>
            </div>

            <MaterialGraph data={filteredSanctionList} />
          </div>

          <div className="PURCHASE_REPORT shadow-inner bg-[#ffffff] p-10 rounded mx-5 mt-20">
            <h1 className="text-3xl font-bold text-left pb-5">
              Purchase Report
            </h1>
            <hr class="border-t border-gray-150" />

            <div className="Stats w-full flex flex-wrap">
              <div className="bg-gray-200 p-4 m-2 flex-1">
                <header className="font-bold mb-2">Number of Purchases</header>
                <p className="text-lg">234</p>
              </div>
              <div className="bg-gray-200 p-4 m-2 flex-1">
                <header className="font-bold mb-2">
                  Prize worth of Purchases
                </header>
                <p className="text-lg">$10 million</p>
              </div>
              <div className="bg-gray-200 p-4 m-2 flex-1">
                <header className="font-bold mb-2">
                  Prize worth of Sanctions
                </header>
                <p className="text-lg">$10 million</p>
              </div>
            </div>
            <div className="Graphical Stats my-10">
              <div class="flex flex-row flex-wrap justify-around">
                <MaterialPieChartPurchase data={filteredPurchaseList} />
                <PricePieChartSanction data={filteredSanctionList} />
              </div>
            </div>

            <div className="PURCHASE_TABLE">
              <table className="min-w-full divide-y divide-gray-200 table-auto border rounded-lg">
                <caption class="caption-bottom">Table : Purchases</caption>
                <thead className="bg-[#c8d8e4]">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Purchase ID
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Material
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Quantity Purchased
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Vendor Details
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Date & Time
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPurchaseList.map((purchase) => (
                    <tr key={purchase.purchase_id}>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {purchase.purchase_id}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {purchase.material_name}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {purchase.quantity_purchased}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {purchase.vendor_details}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {new Date(purchase.date_time).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="Materialwisepurchase my-20">
              <table className="min-w-full divide-y divide-gray-200 table-auto border rounded-lg">
                <caption class="caption-bottom">
                  Table : Materials Wise Purchase Cost
                </caption>
                <thead className="bg-[#c8d8e4]">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Material
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Price
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {Object.entries(materialPurchaseWisePrice).map(
                    ([material, price]) =>
                      material !== "Total Price" && (
                        <tr key={material} className="border-b border-gray-300">
                          <td className="px-4 py-2 whitespace-nowrap">
                            {material}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap">
                            {price}
                          </td>
                        </tr>
                      )
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
