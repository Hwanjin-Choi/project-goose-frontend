// Layout.js
import React from "react";
import styled, { ThemeProvider } from "styled-components"; // ThemeProvider 추가
import Header, { HEADER_HEIGHT } from "../Header/Header";

// 테마 객체 정의: 공통 스타일 값(예: maxWidth)을 관리합니다.
const theme = {
  maxWidth: "1200px", // 스크린샷과 유사한 콘텐츠 최대 너비 (예시, 필요에 따라 조정)
  // 다른 공통 스타일 값들을 여기에 추가할 수 있습니다.
  // mobileBreakpoint: '768px',
};

const AppWrapper = styled.div`
  min-height: 100vh;
  padding-top: ${HEADER_HEIGHT};
  margin: 0 auto;
  @media (min-width: 768px) {
    max-width: 720px;
  }
  @media (min-width: 1024px) {
    max-width: 960px;
  }
  width: 100%;
`;

const LayoutContainer = styled.div`
  position: relative;
  box-sizing: border-box;
  overflow-y: scroll;
  min-height: 100vh;
  height: 100%;
`;

const MainContent = styled.main`
  padding: 20px; /* 콘텐츠 내부의 패딩 */
`;

const Layout = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      {" "}
      <Header />{" "}
      <AppWrapper>
        <LayoutContainer>
          <MainContent>{children}</MainContent>
        </LayoutContainer>
      </AppWrapper>
    </ThemeProvider>
  );
};

export default Layout;
