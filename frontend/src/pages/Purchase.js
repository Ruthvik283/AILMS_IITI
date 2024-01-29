import React, { useState, useEffect } from 'react';
import Footer2  from '../components/Footer'
import Navbar  from '../components/Navbar'
import PurchaseTable from '../components/PurchaseTable';


export default function Purchase() {

    return (
        <>

            <Navbar></Navbar>
            
            
            <PurchaseTable/>

            <Footer2></Footer2>

        </>
    )
}