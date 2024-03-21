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
    <div>
      <input type="date" onChange={handleStartDateChange} />
      <input type="date" onChange={handleEndDateChange} />
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

export default PurchaseTable;
