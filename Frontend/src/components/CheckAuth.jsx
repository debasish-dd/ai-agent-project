import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import axios from "axios";

function CheckAuth({ children, isProtected }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/v1/users/check-auth",
          { withCredentials: true },
        );
        console.log("res-" , response);
        
        setIsAuthenticated(response.status === 200);
      } catch (error) {
        if (error.response?.status === 401) {
          setIsAuthenticated(false); 
        } else {
          console.error("Unexpected auth error:", error); 
        }
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!loading) {
      if (isProtected && !isAuthenticated) {
        navigate("/");
      }

      if (!isProtected && isAuthenticated) {
        navigate("/tickets");
      }
    }
  }, [navigate, loading, isAuthenticated, isProtected]);

  if (loading) {
    return <div>Loading...</div>;
  } else {
    return <Outlet />;
  }
}

export default CheckAuth;
