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
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(contextData.userData),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        ////console.log("report-sanctions", data);
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
        //console.log("fetched_department_data", data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const [purchaseData, setPurchaseData] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/purchases/NULL/NULL/`,
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
  }, []);




  const fields = [
    { name: "Purchase" },
    { name: "Sanction"},
  ];

  const purchaseType = [
    { name: "Type A" },
    { name: "Type B"},
    {name:"Type C"}
  ];


  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };

  //for the filtering
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [selectedFields, setSelectedFields] = useState([]);
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [selectedPurchaseType, setSelectedPurchaseType] = useState([]);
  const [selectedShowSubDepartments, setSelectedShowSubDepartments] = useState([]);
  const [selectedSubDepartments, setSelectedSubDepartments] = useState([]);

  const [filteredSanctionList, setFilteredSanctionList] = useState([]);
  const [filteredPurchaseList, setFilteredPurchaseList] = useState([]);



  const filterSanctionDataByMaterials = (filteredSanctionData) => {
    if (!selectedMaterials) {
      return filteredSanctionData; // Return the original data if selectedMaterials is falsy
    }
  
    // Filter the data based on selected materials
    const filteredData = filteredSanctionData.filter((sanction) => {
      // Check if any selected material matches the material_name of the sanction
      return selectedMaterials.some((mat) => mat.material_name === sanction.material_name);
    });
  
    return filteredData;
  };
  
  const filterSanctionDataByDepartment = (filteredSanctionData) => {
    if (!selectedDepartments) {
      return;
    }

    // let filteredData = [...sanctionData]; // Create a copy of the original data

    const filteredData = filteredSanctionData.filter((sanction) => {
      return selectedDepartments.some(
        (mat) => mat.department_name === sanction.department_name
      );
    });
    // filteredData = filterByDate(filteredData);
    return filteredData;
  };
  const filterPurchaseDataByMaterials = (filteredPurchaseData) => {
    if (!selectedMaterials) {
      return;
    }

    // let filteredData = [...purchaseData]; // Create a copy of the original data

    const filteredData = filteredPurchaseData.filter((sanction) => {
      return selectedMaterials.some(
        (mat) => mat.material_name === sanction.material_name
      );
    });
    return filteredData;
  };
  const filterPurchaseDataByPurchaseType= (filteredPurchaseData) => {
    if (!selectedPurchaseType) {
      return;
    }

    const filteredData = filteredPurchaseData.filter((purchase) => {
      return selectedPurchaseType.some(
        (mat) => mat.name === purchase.purchase_type
      );
    });
    return filteredData;
  };
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

 


  // const [showSanctionTable, setShowSanctionTable] = useState(false);
  // const [showPurchaseTable, setShowPurchaseTable] = useState(false);

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


  const handleDepartmentChange = (e) => {
    setSelectedDepartments(e.value);
    setSelectedSubDepartments([]); // Resetting selected sub-departments
  };


  const filterAll=(selectedDepartments, selectedMaterials, endDate, startDate)=>{
    let filteredSanction = [...sanctionData];
    let filteredPurchase = [...purchaseData];
  
    // Apply filters
    filteredSanction = filterByDate(filteredSanction);
    filteredSanction = filterSanctionDataByDepartment(filteredSanction);
    filteredSanction = filterSanctionDataByMaterials(filteredSanction);
  
    filteredPurchase = filterByDate(filteredPurchase);
    filteredPurchase = filterPurchaseDataByMaterials(filteredPurchase);
    filteredPurchase = filterPurchaseDataByPurchaseType(filteredPurchase);
  
    // Set filtered lists
    setFilteredSanctionList(filteredSanction);
    setFilteredPurchaseList(filteredPurchase);
  }
  
  useEffect(() => {  
    setSelectedShowSubDepartments([]);
    
    const subDepartments = departmentData.filter((department) => {
      // Check if the department is a sub-department and matches any selected department name
      return !department.is_main && selectedDepartments.some(
        (mat) => mat.department_name== department.parent_department_name)
    });
  
    setSelectedShowSubDepartments(subDepartments);
  }, [selectedDepartments]);
  
  
  const [showReport, setShowReport] = useState(false);

  return (
    <>
      <div className="FILTERS bg-white my-10 rounded shadow-md">
        <div className="px-10 py-5">
          Please select the fields you wish to include in the report.
        </div>
        <hr class="border-t border-gray-300 mx-10" />
{/* filters */}
        <div className="ml-20 mr-10 my-5">
          <div className="card flex flex-col justify-content-center my-5">
            <label className="text-gray-700 my-2	">Department:</label>
            <MultiSelect
              value={selectedDepartments}
              onChange={handleDepartmentChange}
              options={departmentData.filter(
                (department) => department.is_main === true
              )}
              optionLabel="department_name"
              placeholder="Select Department"
              maxSelectedLabels={5}
              className="w-full md:w-20rem border border-gray-100"
            />
          </div>
          <div className="card flex flex-col justify-content-center my-5">
          <label className="text-gray-700 my-2	">Sub-Departments:</label>

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
          <div className="card flex flex-col justify-content-center my-5">
          <label className="text-gray-700 my-2	">Materials:</label>

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
          <div className="card flex flex-col justify-content-center my-5">
          <label className="text-gray-700 my-2	">Fields:</label>

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
          <div className="card flex flex-col justify-content-center my-5">
          <label className="text-gray-700 my-2	">Type of Purchase:</label>

            <MultiSelect
              value={selectedPurchaseType}
              onChange={(e) => setSelectedPurchaseType(e.value)}
              options={purchaseType}
              optionLabel="name"
              placeholder="Select Purchase Type"
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
                filterAll();
                setShowReport(true);
                // filterSanctionData();
                // filterPurchaseData();
                // filterData();
              }}
              className="flex-1 font-bold text-xl bg-white px-6 py-3 rounded-xl w-full button-48"
            >
              <span className="text">GENERATE REPORT</span>
            </button>
            {/* </div> */}
          </div>
        </div>
      </div>

      



      {showReport && (
        <div className="REPORT_RESULTS justify-center items-center py-20 mx-10">
          <div className="SANCTION_REPORT shadow-inner bg-[#FFFEFA] p-10 rounded mx-5 my-5">
            <h1 className="text-3xl font-bold text-left pb-5">
              Sanction Report
            </h1>
            <hr class="border-t border-gray-150" />

            <div className="Stats w-full flex flex-wrap">
              <div className="bg-gray-200 p-4 m-2 flex-1">
                <header className="font-bold mb-2">Number of Sanctions</header>
                <p className="text-lg">{filteredSanctionList.length}</p>
              </div>
              <div className="bg-gray-200 p-4 m-2 flex-1">
                <header className="font-bold mb-2">
                  Prize worth of Sanctions
                </header>
                <p className="text-lg"> {Object.entries(materialSanctionWisePrice).map(
                    ([material, price]) =>
                      material === "Total Price" && (
                        <tr key={material} className="hover:bg-gray-50">
                      
                          <td className="px-4 py-2 whitespace-nowrap">
                            Rs. {price}
                          </td>
                        </tr>
                      )
                  )}</p>
              </div>
              {/* <div className="bg-gray-200 p-4 m-2 flex-1">
                <header className="font-bold mb-2">
                  Prize worth of Sanctions
                </header>
                <p className="text-lg">$10 million</p>
              </div> */}
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
                        {sanction.material_name}
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
                <p className="text-lg">{filteredPurchaseList.length}</p>
              </div>
              <div className="bg-gray-200 p-4 m-2 flex-1">
                <header className="font-bold mb-2">
                  Prize worth of Sanctions
                </header>
                <p className="text-lg">{Object.entries(materialPurchaseWisePrice).map(
                    ([material, price]) =>
                      material === "Total Price" && (
                        <tr key={material} className="border-b border-gray-300">
                          
                          <td className="px-4 py-2 whitespace-nowrap">
                            Rs. {price}
                          </td>
                        </tr>
                      )
                  )}</p>
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
