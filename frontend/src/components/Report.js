import React, { useState, useEffect, useContext } from "react";
import { MultiSelect } from "primereact/multiselect";
import AuthContext from "../context/AuthContext";
import MaterialGraph from "./Graph";
import SanctionGraph from "./SanctionGraph";
import MaterialPieChartSanction from "./MaterialPieChartSanction";
import PricePieChartPurchase from "./PricePieChartPurchase";
import { Link } from "react-router-dom";
import "./Report.css";
import toast from "react-hot-toast";

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
        const tokenString = localStorage.getItem('authTokens');
        const token = tokenString ? JSON.parse(tokenString).access : null;

        const headers = {
          'Content-Type': 'application/json',
        };
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }
        const response = await fetch("/api/sanctions/", {
          method: "POST",
          headers: headers,
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
        setPurchaseData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const fields = [{ name: "Purchase" }, { name: "Approval" }];

  const purchaseType = [
    { name: "Direct" },
    { name: "Gem" },
    { name: "LPC" },
    { name: "AMC/CMC" },
  ];

  
  const sanctionType = [
    { name: "A" },
    { name: "B" },
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
  const [selectedSanctionType, setSelectedSanctionType] = useState([]);
  const [selectedShowSubDepartments, setSelectedShowSubDepartments] = useState(
    []
  );

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
      return selectedMaterials.some(
        (mat) => mat.material_name === sanction.material_name
      );
    });

    return filteredData;
  };

  const filterSanctionDataBySubDepartment = (filteredSanctionData) => {
    if (!selectedSubDepartments) {
      return;
    }

    // let filteredData = [...sanctionData]; // Create a copy of the original data

    const filteredData = filteredSanctionData.filter((sanction) => {
      return selectedSubDepartments.some(
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
  const filterPurchaseDataByPurchaseType = (filteredPurchaseData) => {
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
  const filterSanctionDataBySanctionType = (filteredSanctionData) => {
    if (!selectedSanctionType) {
      return;
    }

    const filteredData = filteredSanctionData.filter((sanction) => {
      return selectedSanctionType.some(
        (mat) => mat.name === sanction.sanct_type
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

  const filterAll = (
    selectedDepartments,
    selectedMaterials,
    endDate,
    startDate
  ) => {
    // Apply filters

    if (isSanction) {
      let filteredSanction = [...sanctionData];
      filteredSanction = filterByDate(filteredSanction);
      filteredSanction = filterSanctionDataBySubDepartment(filteredSanction);
      filteredSanction = filterSanctionDataByMaterials(filteredSanction);
      filteredSanction = filterSanctionDataBySanctionType(filteredSanction);
      if(filteredSanction.length===0){
        toast.error("No approvals match the selected filters.");
      }
      else{
      setShowSanction(true);
      }
      setFilteredSanctionList(filteredSanction);
      // if(filteredSanctionList.length===0){
      //   toast.error("no entry exists to display");
      //   return;
      // }
      // setShowSanction(true);
    }
    if (isPurchase) {
      let filteredPurchase = [...purchaseData];
      filteredPurchase = filterByDate(filteredPurchase);
      filteredPurchase = filterPurchaseDataByMaterials(filteredPurchase);
      filteredPurchase = filterPurchaseDataByPurchaseType(filteredPurchase);
    if(filteredPurchase.length===0){
        toast.error("No purchases match the selected filters.");
        //return;
    }
    else{
    setShowPurchase(true);
    }
      // Set filtered lists
    setFilteredPurchaseList(filteredPurchase);

    }
  };



// for updating subDepartments when ddepartment changes
  useEffect(() => {
    setSelectedShowSubDepartments([]);

    const subDepartments = departmentData.filter((department) => {
      // Check if the department is a sub-department and matches any selected department name
      return (
        !department.is_main &&
        selectedDepartments.some(
          (mat) => mat.department_name == department.parent_department_name
        )
      );
    });

    const noSubDept = departmentData.filter((department) => {
      return (
        department.is_main &&
        // department.sub_departments.length === 0 && // Check if sub_departments array is empty
        selectedDepartments.some(
          (mat) => mat.department_name === department.department_name
        )
      );
    });
    // Concatenate subDepartments and xyz arrays
    const combinedDepartments = [...subDepartments, ...noSubDept];
    setSelectedShowSubDepartments(combinedDepartments);
    setSelectedSubDepartments(combinedDepartments);
  }, [selectedDepartments]);

  const handleSubmit = async (event) => {
    if (selectedFields.length === 0) {
      toast.error("Please select a Sanction and/or Purchase");
      return;
    }

    if (isSanction && isPurchase) {
      if (selectedMaterials.length === 0) {
        toast.error("Please select a material");
        return;
      }
      // purchase
      if (selectedPurchaseType.length === 0) {
        toast.error("Please select a Purchase Type");
        return;
      }
      // sanction
      if (selectedDepartments.length === 0) {
        toast.error("Please select department");
        return;
      }
      if (selectedSanctionType.length === 0) {
        toast.error("Please select a Sanction type");
        return;
      }
    } else if (isSanction) {
      if (selectedMaterials.length === 0) {
        toast.error("Please select a material");
        return;
      }
      // sanction
      if (selectedDepartments.length === 0) {
        toast.error("Please select department");
        return;
      }
      if (selectedSanctionType.length === 0) {
        toast.error("Please select a Sanction type");
        return;
      }
    } else if (isPurchase) {
      if (selectedMaterials.length === 0) {
        toast.error("Please select a material");
        return;
      }
      // purchase
      if (selectedPurchaseType.length === 0) {
        toast.error("Please select a Purchase type");
        return;
      }
    }
    setShowPurchase(false);
    setShowSanction(false);
    filterAll();
   // CheckEntryExistance();
  };

  const [isPurchase, setIsPurchase] = useState(false);
  const [isSanction, setIsSanction] = useState(false);
  const [showSanction, setShowSanction] = useState(false);
  const [showPurchase, setShowPurchase] = useState(false);

  useEffect(() => {
    const purchasePresent = selectedFields.some(
      (item) => item.name === "Purchase"
    );
    setIsPurchase(purchasePresent);

    const sanctionPresent = selectedFields.some(
      (item) => item.name === "Approval"
    );
    setIsSanction(sanctionPresent);
  }, [selectedFields]);


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
          {isSanction && (
            <div>
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
                <label className="text-gray-700 my-2	">Type of Sanction:</label>

                <MultiSelect
                  value={selectedSanctionType}
                  onChange={(e) => setSelectedSanctionType(e.value)}
                  options={sanctionType}
                  optionLabel="name"
                  placeholder="Select Sanction Type"
                  maxSelectedLabels={10}
                  className="w-full md:w-20rem border border-gray-100"
                />
              </div>
            </div>
          )}
          {isPurchase && (
            <div>
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
            </div>
          )}
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
        </div>
        <button
          type="button"
          onClick={handleSubmit}
          className="flex-1 font-bold text-xl bg-white px-6 py-3 rounded-xl w-full button-48"
        >
          <span className="text">GENERATE REPORT</span>
        </button>
      </div>

      <div className="REPORT_RESULTS justify-center items-center py-20 mx-10" style={{ margin: window.innerWidth <= 600 ? '2px' : '10px' }}>
        {showSanction && (
          <div className="SANCTION_REPORT shadow-inner bg-[#FFFEFA] p-10 rounded my-5">
            <h1 className="text-3xl font-bold text-left pb-5">
              Approval Report
            </h1>
            <hr class="border-t border-gray-150" />

            <div className="Stats w-full flex flex-wrap">
              <div className="bg-gray-200 p-4 m-2 flex-1">
                <header className="font-bold mb-2">Number of Approvals</header>
                <p className="text-lg">{filteredSanctionList.length}</p>
              </div>
              <div className="bg-gray-200 p-4 m-2 flex-1">
                <header className="font-bold mb-2">
                  Price worth of Approvals
                </header>
                <p className="text-lg">
                  {" "}
                  {Object.entries(materialSanctionWisePrice).map(
                    ([material, price]) =>
                      material === "Total Price" && (
                        <tr key={material} className="hover:bg-gray-50">
                          <td className="px-4 py-2 whitespace-nowrap">
                            Rs. {price}
                          </td>
                        </tr>
                      )
                  )}
                </p>
              </div>
              {/* <div className="bg-gray-200 p-4 m-2 flex-1">
                <header className="font-bold mb-2">
                  Price worth of Sanctions
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
            <div className="SANCTION_TABLE overflow-x-auto">
              <table className="w-full leading-normal table-auto border rounded-lg">
                <caption class="caption-bottom">Table : Sanctions</caption>
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-white uppercase tracking-wider bg-[#c8d8e4] ">
                      Approval ID
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
                      Approval Type
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-white uppercase tracking-wider bg-[#c8d8e4] ">
                      Date and Time
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-white uppercase tracking-wider bg-[#c8d8e4] ">
                      Quantity Approved
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
                        {sanction.department_name}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {sanction.engineer_name}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {sanction.technician_name}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {sanction.material_name}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {sanction.sanct_type}
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
        )}

     {showPurchase && ( <div className="PURCHASE_REPORT shadow-inner bg-[#ffffff] p-10 rounded mt-20">
          <h1 className="text-3xl font-bold text-left pb-5">Purchase Report</h1>
          <hr class="border-t border-gray-150" />

          <div className="Stats w-full flex flex-wrap">
            <div className="bg-gray-200 p-4 m-2 flex-1">
              <header className="font-bold mb-2">Number of Purchases</header>
              <p className="text-lg">{filteredPurchaseList.length}</p>
            </div>
            <div className="bg-gray-200 p-4 m-2 flex-1">
              <header className="font-bold mb-2">
                Price worth of Purchases
              </header>
              <p className="text-lg">
                {Object.entries(materialPurchaseWisePrice).map(
                  ([material, price]) =>
                    material === "Total Price" && (
                      <tr key={material} className="border-b border-gray-300">
                        <td className="px-4 py-2 whitespace-nowrap">
                          Rs. {price}
                        </td>
                      </tr>
                    )
                )}
              </p>
            </div>
          </div>
          <div className="Graphical Stats my-10">
            <div class="flex flex-row flex-wrap justify-around">
              <MaterialPieChartPurchase data={filteredPurchaseList} />
              <PricePieChartPurchase data={filteredPurchaseList} />
            </div>
          </div>

          <div className="PURCHASE_TABLE overflow-x-auto">
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
                    Purchase Type
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
                      {purchase.purchase_type}
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
                        <td className="px-4 py-2 whitespace-nowrap">{price}</td>
                      </tr>
                    )
                )}
              </tbody>
            </table>
          </div>
        </div>)}

      </div>
      {/* <button
            onClick={window.print()}
            className="bg-[#3c50e0] hover:bg-[#6272e6] text-white font-bold py-2 px-4 rounded"
          >
            Print
          </button> */}
    </>
  );
}
