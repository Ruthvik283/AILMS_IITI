import React from 'react';
import purchaseData from './purchaseData';

const PurchaseTable = () => {
  return (
    <div>
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
