import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import axios from "axios";

function CheckAuth({ children, isProtected }) {
  const navigate = useNavigate();
const [loading, setLoading] = useState(true) 
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        await axios.get(
          "http://localhost:3000/api/v1/users/check-auth",
          { withCredentials: true }
        );
        // if we're here, user is authenticated
        if (!isProtected) navigate("/tickets");
      } catch (error) {
        // if we're here, user is not authenticated
        if (isProtected) navigate("/");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  } else {
    return <Outlet />;
  }
}

export default CheckAuth;
