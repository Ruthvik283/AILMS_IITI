import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Purchase from "./pages/Purchase";
import Sanction from "./pages/Sanction";
import Material from "./pages/Material";
import SanctionFormPage from "./pages/SanctionFormPage";
import PurchaseFormPage from "./pages/PurchaseFormPage";
import LoginPage from "./pages/Login";
import { AuthProvider } from "./context/AuthContext";
import SignupPage from "./pages/Signup";
import { Toaster } from "react-hot-toast";

export default function App() {
  return (
    <>
      <Toaster />
      <Router scrollBehavior="auto">
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/" element={<Home />} />
            <Route path="/purchase" element={<Purchase />} />
            <Route path="/sanction" element={<Sanction />} />
            <Route path="/material" element={<Material />} />
            <Route path="/purchaseform" element={<PurchaseFormPage />} />
            <Route path="/sanctionform" element={<SanctionFormPage />} />
          </Routes>
        </AuthProvider>
      </Router>
    </>
  );
}
