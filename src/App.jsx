import { useState } from "react";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import GlobalStyle from "./assets/GlobalStyles";
import LandingPage from "./pages/LandingPage/LandingPage";
import LoginPage from "./pages/LoginPage/SignIn";

const HomePage = () => (
  <div style={{ padding: "20px" }}>
    <h1>홈페이지</h1>
    <p>이곳은 홈페이지의 내용이옵니다.</p>
    <h1>소개 페이지</h1>
    <p>저희 서비스에 대한 소개이옵니다.</p>
    <h1>소개 페이지</h1>
    <p>저희 서비스에 대한 소개이옵니다.</p>
    <h1>소개 페이지</h1>
    <p>저희 서비스에 대한 소개이옵니다.</p>
    <h1>소개 페이지</h1>
    <p>저희 서비스에 대한 소개이옵니다.</p>
    <h1>소개 페이지</h1>
    <p>저희 서비스에 대한 소개이옵니다.</p>
    <h1>소개 페이지</h1>
  </div>
);
const AboutPage = () => (
  <div style={{ padding: "20px" }}>
    <h1>소개 페이지</h1>
    <p>저희 서비스에 대한 소개이옵니다.</p>
  </div>
);

const App = () => {
  return (
    <>
      <Router>
        <GlobalStyle />
        <Layout>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/login" element={<LoginPage />} />
            {/* <Route path="*" element={<NotFoundPage />} /> */}
          </Routes>
        </Layout>
      </Router>
    </>
  );
};

export default App;
