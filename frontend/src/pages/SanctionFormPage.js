import React, { useState, useEffect } from 'react';
import Footer2  from '../components/Footer'
import Navbar  from '../components/Navbar'
import SanctionForm from '../components/SanctionForm';


export default function SanctionFormPage() {

    return (
        <>
        <div className="min-h-screen">

            <Navbar></Navbar>
            
            
            <SanctionForm/>
        </div>
            <Footer2></Footer2>

        </>
    )
}