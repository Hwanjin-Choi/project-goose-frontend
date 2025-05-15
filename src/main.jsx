import React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import Signup_Page from "./pages/Signup_Page.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/Signup_Page" element={<Signup_Page />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
