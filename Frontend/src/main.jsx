import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import CheckAuth from "./components/CheckAuth";
import Tickets from "./pages/Tickets";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Admin from "./pages/Admin";
import PublicLayout from "./layouts/PublicLayout";
import ProtectedLayout from "./layouts/ProtectedLayout";
import DetailedTicket from "./pages/DetailedTicket";
import { UserProvider } from "./store/UserContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <UserProvider>
        <Routes>
          {/* PUBLIC ROUTES */}
          <Route element={<CheckAuth isProtected={false} />}>
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </Route>
          </Route>

          {/* PROTECTED ROUTES */}
          <Route element={<CheckAuth isProtected={true} />}>
            <Route element={<ProtectedLayout />}>
              <Route path="/tickets" element={<Tickets />} />
              <Route path="/tickets/:id" element={<DetailedTicket />} />
              <Route path="/admin" element={<Admin />} />
            </Route>
          </Route>
        </Routes>
      </UserProvider>
    </BrowserRouter>
  </StrictMode>,
);
