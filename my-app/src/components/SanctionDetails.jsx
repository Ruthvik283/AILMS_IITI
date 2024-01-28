import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const SanctionDetails = () => {
  // Fetch and display the details from your API or data source
  // For demonstration purposes, let's create sample data
  const [sanctionDetailsData, setSanctionDetailsData] = useState([
    {
      ticketNumber: '12345',
      technician: 'John Doe',
      materialRequested: 'Material A',
      quantity: 5,
     
      available: true,
    },
    {
      ticketNumber: '67890',
      technician: 'Jane Smith',
      materialRequested: 'Material B',
      quantity: 10,
      
      available: false,
    },
    {
      ticketNumber: '11223',
      technician: 'Bob Johnson',
      materialRequested: 'Material C',
      quantity: 8,
     
      available: true,
    },
    // Add more data as needed
  ]);

  const handleApproveClick = (ticketNumber) => {
    // Handle the approval logic here (you can make an API call or update the state)
    console.log(`Approved for ticket number: ${ticketNumber}`);
    // Update the button text to show "Approved"
    setSanctionDetailsData((prevData) =>
      prevData.map((item) =>
        item.ticketNumber === ticketNumber
          ? { ...item, actionText: 'Approved' }
          : item
      )
    );
  };

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
      <h1 className="text-3xl font-bold mb-4">Sanction Details</h1>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 border-b">Ticket Number</th>
            <th className="py-2 px-4 border-b">Technician</th>
            <th className="py-2 px-4 border-b">Material Requested</th>
            <th className="py-2 px-4 border-b">Quantity</th>
           
            <th className="py-2 px-4 border-b">Available</th>
            <th className="py-2 px-4 border-b">Action</th>
          </tr>
        </thead>
        <tbody>
          {sanctionDetailsData.map((item) => (
            <tr key={item.ticketNumber}>
              <th className="py-2 px-4 border-b font-normal">{item.ticketNumber}</th>
              <th className="py-2 px-4 border-b font-normal">{item.technician}</th>
              <th className="py-2 px-4 border-b font-normal">{item.materialRequested}</th>
              <th className="py-2 px-4 border-b font-normal">{item.quantity}</th>
              
              <th className="py-2 px-4 border-b font-normal">{item.available ? 'Yes' : 'No'}</th>
              <td className="py-2 px-4 border-b">
                <button
                   className={`px-3 py-1 rounded-lg ${
                    item.isApproved ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'
                  }`}
                  onClick={() => {
                    handleApproveClick(item.ticketNumber);
                    // Add the following line to update the item's approval status
                    item.isApproved = true;
                  }}
                >
                  {item.isApproved ? 'Approved' : 'Approve'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div>
  );
};

export default SanctionDetails;
