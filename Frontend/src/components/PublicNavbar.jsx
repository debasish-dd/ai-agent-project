import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

function PublicNavbar() {
    const navigate = useNavigate()
    return (
    <div>
        <nav>
            <ul className=' flex gap-5 p-2 m-2'>
                <Link to="/">Login</Link>
                <Link to="/signup">Signup</Link>
            </ul>
        </nav>
    </div>
  )
}

export default PublicNavbar