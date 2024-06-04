import React from 'react'
import { Outlet, Link } from "react-router-dom";
import Footer from './components/Footer';
import Header from './components/Header';

function Layout() {
  

  return (
    <div className="">
        <div className='bg-gray-200'>
        <Header/>
        <Outlet/>
        <Footer/>
        </div>
    </div>
  )
}

export default Layout