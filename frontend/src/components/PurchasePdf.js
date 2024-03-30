import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const PurchasePdf = () => {
    return (
        <>
            <h1>View PDF</h1>
            <center>
                <iframe
                    id="iFrameExample"
                    title="iFrame Example"
                    src="http://127.0.0.1:8000/api/api_test/"
                    height="700px"
                    width="1000px"
                ></iframe>
            </center>
        </>
    );
};

export default PurchasePdf;
