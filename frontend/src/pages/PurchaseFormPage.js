import React, { useState, useEffect } from 'react';
import Footer2  from '../components/Footer'
import Navbar  from '../components/Navbar'
import PurchaseTable from '../components/PurchaseTable';
import PurchaseForm from '../components/PurchaseForm';


export default function PurchaseFormPage() {

    return (
        <>

            <Navbar></Navbar>
            
            
            <PurchaseForm/>

            <Footer2></Footer2>

        </>
    )
}