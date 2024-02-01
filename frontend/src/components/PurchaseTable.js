import React from 'react';
import purchaseData from './purchaseData';
import { useEffect, useState } from 'react';

const PurchaseTable = () => {
  const [purchaseData, setPurchaseData] = useState([]);
  const [startDate, setStartDate] = useState([]);
  const [endDate, setEndDate] = useState([]);
  const [Dates, setDates] = useState(["NULL","NULL"]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/purchases/NULL/NULL/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setPurchaseData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);
  return (
    <div>
      <input type="date" />
      <input type="date" />
      <h2 className="text-xl font-bold mb-4">Purchase List</h2>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purchase ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Material</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity Purchased</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor Details</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {purchaseData.map(purchase => (
            <tr key={purchase.purchase_id}>
              <td className="px-6 py-4 whitespace-nowrap">{purchase.purchase_id}</td>
              <td className="px-6 py-4 whitespace-nowrap">{purchase.material}</td>
              <td className="px-6 py-4 whitespace-nowrap">{purchase.quantity_purchased}</td>
              <td className="px-6 py-4 whitespace-nowrap">{purchase.vendor_details}</td>
              <td className="px-6 py-4 whitespace-nowrap">{new Date(purchase.date_time).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PurchaseTable;
