import React from 'react';
import sanctionData from './sanctionData';
import { useEffect, useState } from 'react';

const SanctionTable = () => { 
  const [sanctionData, setSanctionData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/sanctions/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setSanctionData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);
  
  // console.log(sanctionData);
  
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Sanction List</h2>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sanction ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ticket ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Engineer ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Technician ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Material</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity Sanctioned</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sanctionData.map(sanction => (
            <tr key={sanction.sanction_id}>
              <td className="px-6 py-4 whitespace-nowrap">{sanction.sanction_id}</td>
              <td className="px-6 py-4 whitespace-nowrap">{sanction.ticket_id}</td>
              <td className="px-6 py-4 whitespace-nowrap">{sanction.department}</td>
              <td className="px-6 py-4 whitespace-nowrap">{sanction.engineer_id}</td>
              <td className="px-6 py-4 whitespace-nowrap">{sanction.technician_id}</td>
              <td className="px-6 py-4 whitespace-nowrap">{sanction.material}</td>
              <td className="px-6 py-4 whitespace-nowrap">{new Date(sanction.date_time).toLocaleString()}</td>
              <td className="px-6 py-4 whitespace-nowrap">{sanction.quantity_sanctioned}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SanctionTable;
