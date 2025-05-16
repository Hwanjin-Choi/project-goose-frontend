import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Signin from "./pages/signin";
import Signup from "./pages/signup";
import { BrowserRouter, Route, Routes } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
