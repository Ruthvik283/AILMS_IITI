import React, { useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import MaterialsTable from './components/MaterialsTable';
import PurchaseTable from './components/PurchaseTable';
import SanctionTable from './components/SanctionTable';
export default function App() {
    return (
    <>
        <Router scrollBehavior="auto">
            <Routes>
                <Route path="/" element={<Home />} />
            </Routes>
        </Router>
        <MaterialsTable/>
        <PurchaseTable/>
        <SanctionTable/>
    </>
    );
}