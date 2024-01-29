import React, { useState, useEffect } from 'react';
import Footer2  from '../components/Footer'
import Navbar  from '../components/Navbar'
import PurchaseTable from '../components/PurchaseTable';
import MaterialsTable from '../components/MaterialsTable';


export default function Material() {

    return (
        <>

            <Navbar></Navbar>
            
            
            <MaterialsTable/>

            <Footer2></Footer2>

        </>
    )
}