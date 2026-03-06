import React from 'react'
import { Outlet } from 'react-router-dom'
import ProtectedNavbar from '../components/ProtectedNavbar'
function ProtectedLayout() {
  return (
    <div>
       <ProtectedNavbar/>
         <Outlet/>
    </div>
  )
}

export default ProtectedLayout