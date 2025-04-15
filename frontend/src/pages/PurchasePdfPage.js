import React, { useState, useEffect } from 'react';
import Footer2  from '../components/Footer'
import Navbar  from '../components/Navbar'
import PurchaseTable from '../components/PurchaseTable';
import PurchaseForm from '../components/PurchaseForm';
import PurchasePdf from '../components/PurchasePdf';


export default function PurchasePdfPage() {

    return (
        <>
           <div className='bg-[#FFFEFA]'>
            <Navbar></Navbar>
            
            
            <PurchasePdf/>
            </div>
            {/* <Footer2></Footer2> */}

        </>
    )
}