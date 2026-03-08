import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import { useUser } from "../store/UserContext";

function CheckAuth({ children, isProtected }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const { setUser } = useUser()
  


  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/v1/users/check-auth", {
          withCredentials: true,
        });
      // user is authenticated
        setUser(response.data.user)
        if (!isProtected) navigate("/tickets");
      } catch (error) {
        // user is not authenticated
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
