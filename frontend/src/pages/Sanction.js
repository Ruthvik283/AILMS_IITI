import React, { useState, useEffect } from 'react';
import Footer2  from '../components/Footer'
import Navbar  from '../components/Navbar'
import SanctionTable from '../components/SanctionTable';


export default function Sanction() {

    return (
        <>

            <Navbar></Navbar>
            
            <SanctionTable/>

            <Footer2></Footer2>

        </>
    )
}
