import { useState } from "react";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import GlobalStyle from "./assets/GlobalStyles";
import LandingPage from "./pages/LandingPage/LandingPage";
import LoginPage from "./pages/LoginPage/SignIn";
import RegistrationPage from "./pages/SignUpPage/Signup_Page";

const App = () => {
  return (
    <>
      <Router>
        <GlobalStyle />
        <Layout>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/registration" element={<RegistrationPage />} />
            {/* <Route path="*" element={<NotFoundPage />} /> */}
          </Routes>
        </Layout>
      </Router>
    </>
  );
};

export default App;
