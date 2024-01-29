import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const SanctionHistory = () => {
  // Fetch and display the details from your API or data source
  // For demonstration purposes, let's create sample data
  const [sanctionHistoryData, setSanctionHistoryData] = useState([
    {
      ticketNumber: '12345',
      technician: 'John Doe',
      materialRequested: 'Material A',
      quantity: 5,
      dateTime: '2024-01-28 14:30',
      
    },
    {
      ticketNumber: '67890',
      technician: 'Jane Smith',
      materialRequested: 'Material B',
      quantity: 10,
      dateTime: '2024-01-29 10:45',
      
    },
    {
      ticketNumber: '11223',
      technician: 'Bob Johnson',
      materialRequested: 'Material C',
      quantity: 8,
      dateTime: '2024-01-30 09:15',
    
    },
    // Add more data as needed
  ]);

  return (
    <div>
    {/* Navbar */}
    <nav className="flex flex-col md:flex-row justify-between p-4 bg-gray-200 px-8">
      {/* Logo */}
      <div className="mb-4 md:mb-0 md:mr-4">
        <img src="IITI.png" alt="IIT Indore Logo" className="h-16 mt-2" />
      </div>
      {/* Profile Buttons */}
      <div className="text-center md:text-right">
        <Link to="/login">
          <button className="bg-blue-500 text-white px-7 py-3 rounded-lg">
            Profile
          </button>
        </Link> 
      </div>
    </nav>

    <div className="container mx-auto my-8">
      <h1 className="text-3xl font-bold mb-4">Sanction History</h1>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 border-b">Ticket Number</th>
            <th className="py-2 px-4 border-b">Technician</th>
            <th className="py-2 px-4 border-b">Material Requested</th>
            <th className="py-2 px-4 border-b">Quantity</th>
            <th className="py-2 px-4 border-b">Date Time</th>
         
          </tr>
        </thead>
        <tbody>
          {sanctionHistoryData.map((item) => (
            <tr key={item.ticketNumber}>
              <th className="py-2 px-4 border-b font-normal">{item.ticketNumber}</th>
              <th className="py-2 px-4 border-b font-normal">{item.technician}</th>
              <th className="py-2 px-4 border-b font-normal">{item.materialRequested}</th>
              <th className="py-2 px-4 border-b font-normal">{item.quantity}</th>
              <th className="py-2 px-4 border-b font-normal">{item.dateTime}</th>
             
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div>
  );
};

export default SanctionHistory;
