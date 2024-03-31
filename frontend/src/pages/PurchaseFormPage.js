import React, { useState, useEffect } from 'react';
import Footer2  from '../components/Footer'
import Navbar  from '../components/Navbar'
import PurchaseTable from '../components/PurchaseTable';
import PurchaseForm from '../components/PurchaseForm';


export default function PurchaseFormPage() {

    return (
        <>
           <div className='bg-[#FFFEFA]'>
            <Navbar></Navbar>
            
            
            <PurchaseForm/>
            </div>
            <Footer2></Footer2>

        </>
    )
}