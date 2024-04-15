import React, { useState, useEffect } from 'react';
import Footer2  from '../components/Footer'
import Navbar  from '../components/Navbar'
import PurchaseTable from '../components/PurchaseTable';
import MaterialsTable from '../components/MaterialsTable';


export default function Material() {

    useEffect(() => {
        document.title = "Materials-Table - AILMS";
        window.scrollTo(0, 0);
      }, []);

    return (
        <>

            <Navbar></Navbar>
            
            <div className='bg-[#FFFEFA]'>
            <MaterialsTable/>
            </div>

            <Footer2></Footer2>

        </>
    )
}