import React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

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
          <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
            <div className="inline-block min-w-full shadow overflow-hidden">
              <table className="min-w-full leading-normal bg-white">
                <thead className="bg-gray-50">
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
                  {filteredList.map((purchase) => (
                    <tr key={purchase.purchase_id}>
                      <td className="px-5 py-4 border-b border-gray-200 text-sm">{purchase.purchase_id}</td>
                      <td className="px-5 py-4 border-b border-gray-200 text-sm">{purchase.material_name}</td>
                      <td className="px-5 py-4 border-b border-gray-200 text-sm">{purchase.quantity_purchased}</td>
                      <td className="px-5 py-4 border-b border-gray-200 text-sm">{purchase.vendor_details}</td>
                      <td className="px-5 py-4 border-b border-gray-200 text-sm">{new Date(purchase.date_time).toLocaleString()}</td>
                      <td className="px-5 py-4 border-b border-gray-200 text-sm">
                        <Link to={`purchase_pdf/${purchase.purchase_id}`}>
                          <button className="bg-[#52ab98] hover:bg-[#2b6777] text-white font-medium py-2 px-4 rounded">
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

        </div>
        <div>
          <h1 className="text-xl font-bold mb-2">Material-wise Prices:</h1>
          <div className="inline-block min-w-full shadow overflow-hidden">
            <table className="min-w-full leading-normal bg-white">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">MATERIAL</th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">PRICE</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(materialWisePrice).map(([material, price]) => (
                  material !== "Total Price" && (
                    <tr key={material} className="border-b border-gray-300">
                      <td className="px-5 py-4 border-b border-gray-200 text-sm">{material}</td>
                      <td className="px-5 py-4 border-b border-gray-200 text-sm">{price}</td>
                    </tr>
                  )
                ))}
                <tr className="border-b border-gray-300">
                  <td className="px-5 py-4 border-b border-gray-200 text-sm font-semibold">Total Price</td>
                  <td className="px-5 py-4 border-b border-gray-200 text-sm font-semibold">{materialWisePrice["Total Price"]}</td>
                </tr>
              </tbody>

            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PurchaseTable;
