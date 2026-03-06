import React from "react";
import { Outlet } from "react-router-dom";
import PublicNavbar from "../components/PublicNavbar";

function PublicLayout() {
  return (
    <div>
      <PublicNavbar />
      <Outlet />
    </div>
  );
}

export default PublicLayout;
