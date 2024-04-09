import React, { useState, useEffect } from 'react';
import Footer2  from '../components/Footer'
import Navbar  from '../components/Navbar'
import Technician from '../components/Technician';

export default function TechnicianPage(){
  return(
    <>
    <Navbar></Navbar>

    <Technician/>

    <Footer2></Footer2>

    </>
  )
}
