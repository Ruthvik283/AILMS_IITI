// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";

// const PurchasePdf = () => {
//     return (
//         <>
//             <h1>View PDF</h1>
//             <center>
//                 <iframe
//                     id="iFrameExample"
//                     title="iFrame Example"
//                     src="http://127.0.0.1:8000/api/api_test/"
//                     height="700px"
//                     width="1000px"
//                 ></iframe>
//             </center>
//         </>
//     );
// };

// export default PurchasePdf;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import styled from "styled-components";

const PurchasePdf = () => {
  return (
    <Container>
      <Header>View PDF</Header>
      <IFrame
        id="iFrameExample"
        title="iFrame Example"
        src="http://127.0.0.1:8000/api/api_test/"
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