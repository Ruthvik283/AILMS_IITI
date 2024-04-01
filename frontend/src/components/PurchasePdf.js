// // import React, { useState } from "react";
// // import { useNavigate } from "react-router-dom";
// // import toast from "react-hot-toast";

// // const PurchasePdf = () => {
// //     return (
// //         <>
// //             <h1>View PDF</h1>
// //             <center>
// //                 <iframe
// //                     id="iFrameExample"
// //                     title="iFrame Example"
// //                     src="http://127.0.0.1:8000/api/api_test/"
// //                     height="700px"
// //                     width="1000px"
// //                 ></iframe>
// //             </center>
// //         </>
// //     );
// // };

// // export default PurchasePdf;

import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import styled from "styled-components";

const PurchasePdf = () => {
  const { purchase_id } = useParams()
  return (
    <Container>
      <Header>View PDF</Header>
      <IFrame
        id="purchase-pdf"
        title="Purchase PDF"
        src={`http://127.0.0.1:8000/api/purchase-pdf/${purchase_id}`}
      />
    </Container>
  );
};

export default PurchasePdf;

// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center; /* Center vertically */
  align-items: center; /* Center horizontally */
  height: 100vh; /* Full height of the viewport */
`;

const Header = styled.h1`
  font-size: 24px;
  margin-bottom: 20px;
`;

const IFrame = styled.iframe`
  height: 700px;
  width: 1000px;
  border: 1px solid #ccc;
`;
// import React from 'react';
// import { useParams } from 'react-router-dom';

// const PurchasePdf = () => {
//   const { purchaseId } = useParams();

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
//       <h1 className="text-3xl font-bold mb-4 text-gray-800">View PDF</h1>
//       <div className="w-full max-w-4xl">
//         <iframe
//           id="purchase-pdf"
//           title="Purchase PDF"
//           src={`http://127.0.0.1:8000/api/purchase-pdf/${purchaseId}`}
//           className="w-full h-[700px] border border-gray-300 rounded-lg shadow-lg"
//         />
//       </div>
//     </div>
//   );
// };

// export default PurchasePdf;