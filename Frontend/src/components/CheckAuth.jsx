import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function CheckAuth({ children, isProtected }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(async () => {
  try {
     const response = await axios.get("http://localhost:3000/api/v1/users/check-auth", {
      withCredentials: true,  
    });

    if (response.status!==200) {
        setIsAuthenticated(false);
    }else setIsAuthenticated(true )

  } catch (error) {
    setIsAuthenticated(false);
  } finally{
    setLoading(false)
  }
 
  }, []);

  useEffect(async ()=>{
    if (!loading) {
      if (isProtected && !isAuthenticated) {
        navigate("/login");
      }

      if (!isProtected && isAuthenticated) {
        navigate("/");
      }
    }
  } , [navigate, loading, isAuthenticated])

if (loading) {
  return <div>Loading...</div>;
}else{
  return {children}
}
}

export default CheckAuth;
