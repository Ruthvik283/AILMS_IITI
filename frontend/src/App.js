import React, { useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import MaterialsTable from './components/MaterialsTable';
import PurchaseTable from './components/PurchaseTable';
import SanctionTable from './components/SanctionTable';
import PurchaseForm from './components/PurchaseForm';
import SanctionForm from './components/SanctionForm';
import Purchase from './pages/Purchase';
import Sanction from './pages/Sanction';
import Material from './pages/Material';



export default function App() {
    return (
    <>
        <Router scrollBehavior="auto">
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/purchase" element={<Purchase />} />
                <Route path="/sanction" element={<Sanction />} />
                <Route path="/material" element={<Material />} />
            </Routes>
        </Router>
        {/* <MaterialsTable/>
        <PurchaseTable/>
        <SanctionTable/>
        <PurchaseForm/>
        <SanctionForm/> */}
    </>
    );
}