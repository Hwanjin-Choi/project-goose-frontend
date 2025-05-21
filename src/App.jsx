import { useState } from "react";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import GlobalStyle from "./assets/GlobalStyles";
import LandingPage from "./pages/LandingPage/LandingPage";
import LoginPage from "./pages/LoginPage/SignIn";
import RegistrationPage from "./pages/SignUpPage/Signup_Page";
import ViewNewsPage from "./pages/ViewNewsPage/ViewNewsPage";
import ExpiredPage from "./pages/ExpiredPage/ExpiredPage.jsx";
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

            <Route path="/view-news/:keyword" element={<ViewNewsPage />} />

            <Route path="/expired-page" element={<ExpiredPage />} />
            {/* <Route path="*" element={<NotFoundPage />} /> */}
          </Routes>
        </Layout>
      </Router>
    </>
  );
};

export default App;
