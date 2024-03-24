import React from "react";
import { useEffect, useState } from "react";

const PurchaseTable = () => {
  const [purchaseData, setPurchaseData] = useState([]);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  let [materialWisePrice, setmaterialWisePrice] = useState({});
  const [filteredList, setFilteredList] = useState([]);

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
  

  useEffect(() => {
    // Apply filters directly to purchaseData
    let filteredData = purchaseData;
    filteredData = filterByDate(filteredData);
    //console.log("filteredData", filteredData);

    setmaterialWisePrice(
      filteredData.reduce((acc, purchase) => {
        acc["Total Price"] = acc["Total Price"] || 0;
        acc["Total Price"] += purchase.price * purchase.quantity_purchased;

        acc[purchase.material] = acc[purchase.material] || 0;
        acc[purchase.material] += purchase.price * purchase.quantity_purchased;
        return acc;
      }, {})
    );

    // Set the filtered data to the filteredList state
    setFilteredList(filteredData);
  }, [startDate, endDate]);
  //   const materialWisePrice = purchaseData.reduce((acc, purchase) => {
  //     acc["Total Price"] = acc["Total Price"] || 0;
  //     acc["Total Price"] += purchase.price * purchase.quantity_purchased;

  //     acc[purchase.material] = acc[purchase.material] || 0;
  //     acc[purchase.material] += purchase.price * purchase.quantity_purchased;
  //     return acc;
  //   }, {});
  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };
  return (

    <div className="bg-[#c8d8d4]">
        {/* <div className="flex items-center"> */}
          <div className="flex items-left flex-col px-10 py-1">
            <div>Select Start Date</div>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="py-1 px-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              style={{ width: "150px" }}
            />
          </div>

          <div className="flex items-left flex-col px-10 py-1">
            <div>Select End Date</div>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="py-1 px-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              style={{ width: "150px" }}
            />
          </div>
        {/* </div> */}
      <div className=" bg-[#c8d8d4] overflow-x-auto">
        <h1 className="text-2xl font-bold mb-4 p-2 ">Material List</h1>
        <div className="flex">
          <div className="max-w-screen-xl mx-auto px-2 py-2 sm:px-2 lg:px-2 w-full">
            <div className="inline-block min-w-full shadow rounded-lg overflow-hidden ">
              <table className="w-full leading-normal table-auto">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider bg-[#2b6777]">
                      Purchase ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider bg-[#2b6777]">
                      Material
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider bg-[#2b6777]">
                      Quantity Purchased
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider bg-[#2b6777]">
                      Vendor Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider bg-[#2b6777]">
                      Date & Time
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredList.map((purchase) => (
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
            </div>
          </div>
        </div>
      </div>
      <div>
        <h3 className="text-lg font-bold mb-2 py-2">
          Total Price: {materialWisePrice["Total Price"]}
        </h3>
        <h1 className="text-xl font-bold mb-2">Material-wise Prices:</h1>
        <div className="overflow-x-auto pt-4 rounded-lg">
          <table className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-4 py-4 w-full">
            <thead>
              <tr className="bg-[#2b6777]">
                <th className="px-4 py-2 text-centre text-xs font-medium text-white">MATERIAL</th>
                <th className="px-4 py-2 text-centre text-xs font-medium text-white">PRICE</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(materialWisePrice).map(
                ([material, price]) =>
                  material !== "Total Price" && (
                    <tr key={material} className="border-b border-gray-300">
                      <td className="px-4 py-2 bg-white text-center">{material}</td>
                      <td className="px-4 py-2 bg-white">{price}</td>
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

export default PurchaseTable;
