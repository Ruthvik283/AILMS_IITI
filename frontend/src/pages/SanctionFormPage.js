import React, { useState, useEffect } from 'react';
import Footer2  from '../components/Footer'
import Navbar  from '../components/Navbar'
import SanctionForm from '../components/SanctionForm';


export default function SanctionFormPage() {

    useEffect(() => {
        document.title = "Approval - AILMS";
        window.scrollTo(0, 0);
      }, []);

    return (
        <>
        <div className="min-h-screen bg-[#FFFEFA]">

            <Navbar></Navbar>
            
            
            <SanctionForm/>
        </div>
            <Footer2></Footer2>

        </>
    )
}