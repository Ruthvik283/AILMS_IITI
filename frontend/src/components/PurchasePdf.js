import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const PurchasePdf = () => {
  const { purchase_id } = useParams();
  const [src, setSrc] = useState(purchase_id);
  const [invoicePdf, setInvoicePdf] = useState(null);
  const [token, setToken] = useState();
  const [pdfUrl, setPdfUrl] = useState(null);

  const fetchPdf = async () => {
    const tokenString = localStorage.getItem("authTokens");
    const token = tokenString ? JSON.parse(tokenString).access : null;

    if (!token) {
      toast.error("No token found. Please log in.");
      return;
    }

    try {
      const response = await fetch(`/api/purchase-pdf/${purchase_id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch PDF (${response.status})`);
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
    } catch (error) {
      console.error("Error fetching PDF:", error);
      toast.error("Failed to load PDF");
    }
  };

  useEffect(() => {
    document.title = "Purchase Pdf - AILMS";
    window.scrollTo(0, 0);
    document.title = "Approval - AILMS";
    window.scrollTo(0, 0);
    fetchPdf();
    const tokenString = localStorage.getItem("authTokens");
    const token1 = tokenString ? JSON.parse(tokenString).access : null;
    setToken(token1);
  }, []);

  function setPdf(targ) {
    setInvoicePdf(targ.files[0]);
  }

  const pdfsubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("purchase_id", purchase_id);
    formData.append("invoice_pdf", invoicePdf);

    console.log(formData);

    try {
        const tokenString = localStorage.getItem('authTokens');
        const token = tokenString ? JSON.parse(tokenString).access : null;
    
        const headers = {
        //   'Content-Type': 'application/json',
        };
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }

      const response = await fetch("/api/editpdf/", {
        method: "POST",
        headers:headers,
        body: formData,
      });

      if (response.ok) {
        toast.success("Pdf Edited Successfully");
        setSrc(src);
        window.location.reload();
      } else {
        toast.error(`Failed to edit pdf ${response.status}`);
      }
    } catch (error) {
      console.error("Error submitting form: ", error);
    }

  };

  return (
    <div className="flex flex-col items-center justify-center h-500 mb-5">
      <h1 className="text-2xl mb-5">View PDF</h1>
      <iframe
        id="purchase-pdf"
        title="Purchase PDF"
        src={pdfUrl}
        className="w-[1000px] h-[700px] border border-gray-300 rounded-lg overflow-hidden"
      />
      <form onSubmit={pdfsubmit} className="space-y-4 py-8">
        <label htmlFor="invoicePdf" className="block mb-1">
          Add/Replace PDF
        </label>
        <input
          type="file"
          id="invoicePdf"
          onChange={(e) => setPdf(e.target)}
          className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
        />
        <button
          type="submit"
          className="w-full bg-[#52ab98] text-white py-2 px-4 rounded hover:bg-[#2b6777] transition duration-200"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default PurchasePdf;