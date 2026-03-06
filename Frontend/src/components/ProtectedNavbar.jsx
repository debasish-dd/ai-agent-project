import React from 'react'
import { Link } from 'react-router-dom'
function ProtectedNavbar() {
  return (
    <div>
        <nav>
            <ul>
                <Link to={"/tickets"}>
                Tickets
                </Link>
                <Link to={"/admin"}>
                Admin
                </Link>
            </ul>
        </nav>
    </div>
  )
}

export default ProtectedNavbar