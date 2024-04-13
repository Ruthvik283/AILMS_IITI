import React, { useState, useEffect } from 'react';
import Footer2  from '../components/Footer'
import Navbar  from '../components/Navbar'
import RegisterRequestList from '../components/RegisterRequestList';

export default function RegisterRequestPage(){
  useEffect(() => {
    document.title = "Register-Request- AILMS";
    window.scrollTo(0, 0);
  }, []);
  return(
    <>
    <Navbar></Navbar>

    <RegisterRequestList/>

    <Footer2></Footer2>

    </>
  )
}
