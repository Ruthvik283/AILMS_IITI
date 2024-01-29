import React, { useState } from 'react';

const SanctionForm = () => {
  const [ticketId, setTicketId] = useState('');
  const [department, setDepartment] = useState('');
  const [engineerId, setEngineerId] = useState('');
  const [technicianId, setTechnicianId] = useState('');
  const [material, setMaterial] = useState('');
  const [quantitySanctioned, setQuantitySanctioned] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission here
    console.log('Sanction form submitted!');
    // Reset form fields if needed
    setTicketId('');
    setDepartment('');
    setEngineerId('');
    setTechnicianId('');
    setMaterial('');
    setQuantitySanctioned('');
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="ticketId" className="block mb-1">TICKET ID</label>
          <input
            type="text"
            id="ticketId"
            value={ticketId}
            onChange={(e) => setTicketId(e.target.value)}
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <label htmlFor="department" className="block mb-1">DEPARTMENT</label>
          <input
            type="text"
            id="department"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <label htmlFor="engineerId" className="block mb-1">ENGINEER ID</label>
          <input
            type="text"
            id="engineerId"
            value={engineerId}
            onChange={(e) => setEngineerId(e.target.value)}
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <label htmlFor="technicianId" className="block mb-1">TECHNICIAN ID</label>
          <input
            type="text"
            id="technicianId"
            value={technicianId}
            onChange={(e) => setTechnicianId(e.target.value)}
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <label htmlFor="material" className="block mb-1">MATERIAL</label>
          <input
            type="text"
            id="material"
            value={material}
            onChange={(e) => setMaterial(e.target.value)}
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <label htmlFor="quantitySanctioned" className="block mb-1">QUANTITY SANCTIONED</label>
          <input
            type="text"
            id="quantitySanctioned"
            value={quantitySanctioned}
            onChange={(e) => setQuantitySanctioned(e.target.value)}
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
          />
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200">Submit</button>
      </form>
    </div>
  );
};

export default SanctionForm;
