import React, { useState, useEffect } from 'react';
import Footer2  from '../components/Footer'
import Navbar  from '../components/Navbar'
import PurchaseTable from '../components/PurchaseTable';
import MaterialsTable from '../components/MaterialsTable';


export default function Material() {

    return (
        <>

            <Navbar></Navbar>
            
            <div className='bg-[#f1f5f9]'>
            <MaterialsTable/>
            </div>

            <Footer2></Footer2>

        </>
    )
}