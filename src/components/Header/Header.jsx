// Header.js
import React, { useState } from "react";
import styled from "styled-components";

const HEADER_HEIGHT = "60px"; // 헤더의 높이를 상수로 정의하여 다른 곳에서 사용

const HeaderOuterWrapper = styled.header`
  position: fixed; /* 헤더를 상단에 고정합니다. */
  top: 0;
  left: 0;
  width: 100%;
  height: ${HEADER_HEIGHT};
  background-color: #ffffff;
  border-bottom: 1px solid #e0e0e0;
  z-index: 1000; /* 다른 요소들 위에 표시되도록 z-index 설정 */
  display: flex;
  justify-content: center; /* 내부 컨테이너를 중앙 정렬 */
`;

const HeaderInnerWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: ${({ theme }) => theme.maxWidth};
  padding: 0 20px;
  height: 100%;
`;

const LogoContainer = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const LoginButton = styled.button`
  /* 스크린샷의 '로그인' 버튼 스타일 */
  padding: 0.4rem 0.8rem;
  font-size: 0.9rem;
  color: #007bff; /* 파란색 계열 */
  background-color: transparent;
  border: 1px solid #007bff;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: #007bff;
    color: white;
  }
`;

const Header = () => {
  // 드롭다운 관련 로직은 이전과 동일하게 유지하거나 필요에 따라 수정합니다.
  // 스크린샷에는 드롭다운 버튼 대신 '로그인' 버튼이 보이므로, 이를 반영합니다.
  const handleLoginClick = () => {
    console.log("로그인 버튼 클릭");
    // 로그인 로직 또는 페이지 이동 로직
  };

  return (
    <HeaderOuterWrapper>
      <HeaderInnerWrapper>
        <LogoContainer>
          {/* 스크린샷에는 별도의 로고 텍스트가 없으므로, 뒤로가기 아이콘만 배치된 형태입니다. */}
          {/* 필요시 "전하의 로고" 등을 다시 추가하십시오. */}
        </LogoContainer>
        <RightSection>
          {/* 스크린샷의 우측 상단 '로그인' 버튼 */}
          <LoginButton onClick={handleLoginClick}>로그인</LoginButton>
        </RightSection>
      </HeaderInnerWrapper>
    </HeaderOuterWrapper>
  );
};

export { HEADER_HEIGHT }; // 헤더 높이를 export하여 Layout에서 사용
export default Header;
