import React, { useEffect, useState, useContext } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  Outlet,
} from "react-router-dom";
import Home from "./pages/Home";
import Purchase from "./pages/Purchase";
import Sanction from "./pages/Sanction";
import Material from "./pages/Material";
import Materials from "./pages/Materials";
import Departments from "./pages/Departments";
import SanctionFormPage from "./pages/SanctionFormPage";
import PurchaseFormPage from "./pages/PurchaseFormPage";
import LoginPage from "./pages/Login";
import ReportPage from "./pages/ReportPage";
import { AuthProvider } from "./context/AuthContext";
import AuthContext from "./context/AuthContext";
import SignupPage from "./pages/Signup";
import UserList from "./pages/UserList";
import Technicians from "./pages/Technician";
import { Toaster } from "react-hot-toast";
import ModifySanctionForm from "./pages/ModifySanction";
import RegisterRequestList from "./pages/RegisterRequestPage";
import PurchasePdf from "./components/PurchasePdf";
// import <PurchasePdfPage>from "./components/PurchasePdf";
import PurchasePdfPage from "./pages/PurchasePdfPage";

export default function App() {
  //const contextData = useContext(AuthContext);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  //   const PrivateRoute = ({ auth: isAuthenticated, children }) => {
  //     return isAuthenticated ? children : <Navigate to="/login" />;
  //   };
  const PrivateWrapper = ({ auth: isAuthenticated }) => {
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
  };
  //   useEffect(() => {
  //     const fetchData = async () => {
  //       try {
  //         let response = await fetch("/api/token/refresh/", {
  //           method: "POST",
  //           headers: {
  //             "Content-Type": "application/json",
  //           },
  //           body: JSON.stringify({ refresh: contextData.authTokens?.refresh }),
  //         });

  //         let data = await response.json();
  //         if (response.status === 200) {
  //           console.log("App.js lo True");
  //           setIsAuthenticated(true);
  //         } else {
  //           setIsAuthenticated(false);
  //         }
  //       } catch (error) {
  //         console.error("App.js Error fetching data:", error);
  //       }
  //     };

  //     fetchData(); // Immediately invoke the async function
  //   }, []);

  return (
    <>
      <Toaster />
      <Router scrollBehavior="auto">
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            {/* <Route element={<PrivateWrapper />}> */}
            <Route path="/" element={<Home />} />
            <Route path="/purchase" element={<Purchase />} />
            <Route path="/sanction" element={<Sanction />} />
            <Route path="/material" element={<Material />} />
            <Route path="/users" element={<UserList />} />
            <Route path="/technicians" element={<Technicians />} />
            <Route path="/materials" element={<Materials />} />
            <Route path="/departments" element={<Departments />} />
            <Route path="/purchaseform" element={<PurchaseFormPage />} />
            <Route path="/sanctionform" element={<SanctionFormPage />} />
            <Route path="/modifysanction/" element={<ModifySanctionForm />} />
            <Route path="/register_requests" element={<RegisterRequestList />} />
            <Route
              path="/modifysanction/:sanct_id"
              element={<ModifySanctionForm />}
            />
            {/* <Route path="/purchase/purchase_pdf/" element={<PurchasePdf />} /> */}
            <Route
              path="/purchase/purchase_pdf/:purchase_id"
              element={<PurchasePdfPage />}
            />
            <Route path="/report" element={<ReportPage />} />
            {/* </Route> */}
          </Routes>
        </AuthProvider>
      </Router>
    </>
  );
}
