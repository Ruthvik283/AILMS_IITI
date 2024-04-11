import React from "react";
import { useParams } from "react-router-dom";

const PurchasePdf = () => {
  const { purchase_id } = useParams();

  return (
    <div className="flex flex-col items-center justify-center h-screen mb-5">
      <h1 className="text-2xl mb-5">View PDF</h1>
      <iframe
        id="purchase-pdf"
        title="Purchase PDF"
        src={`http://127.0.0.1:8000/api/purchase-pdf/${purchase_id}`}
        className="w-[1000px] h-[700px] border border-gray-300 rounded-lg overflow-hidden"
      />
    </div>
  );
};

export default PurchasePdf;