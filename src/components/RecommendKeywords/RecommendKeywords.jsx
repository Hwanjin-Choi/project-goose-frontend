// src/components/RecommendedKeywords/RecommendedKeywords.jsx

import React from "react";
import { Link } from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components";

// --- 전역 스타일 (폰트 등) ---
// 만약 전체 애플리케이션에 이미 폰트가 설정되어 있다면 이 부분은 필요 없을 수 있습니다.
// 예시로 Inter 폰트를 사용합니다.
const GlobalStyle = createGlobalStyle`
  /* body {
    font-family: 'Inter', sans-serif; // 예시 폰트
  } */
`;

// --- 세련된 다크 테마 스타일 정의 ---

const KeywordsContainer = styled.section`
  /* 페이지 전체 배경이 매우 어둡다고 가정 (예: #0A0C10) */
  /* 이 컴포넌트의 배경은 투명하게 하거나 페이지 배경보다 약간 밝게 설정 가능 */
  /* background-color: #101419; */ /* 선택 사항: 컨테이너 배경색 */
  padding: 40px 0; /* 상하 여백 증가 */
  margin-bottom: 48px; /* 하단 마진 증가 */
  border-top: 1px solid #2a2f37; /* 은은한 상단 구분선 */
  border-bottom: 1px solid #2a2f37; /* 은은한 하단 구분선 */

  @media (max-width: 768px) {
    padding: 24px 0;
    margin-bottom: 32px;
  }
`;

const KeywordsTitle = styled.h3`
  font-size: 0.875rem; /* 14px, 기존보다 약간 작게 하여 라벨 느낌 강조 */
  font-weight: 600; /* Semi-bold */
  color: #7b8899; /* 부드러운 회색 계열 (다크 테마에 적합) */
  text-transform: uppercase; /* 대문자 변환 */
  letter-spacing: 0.075em; /* 자간 미세 조정 */
  margin-bottom: 24px; /* 키워드 목록과의 간격 */
  text-align: left; /* 기본 왼쪽 정렬, 필요시 center로 변경 가능 */
  padding-left: 16px; /* 컨테이너 좌우 패딩과 맞추기 위한 예시 (필요시 조정) */
  padding-right: 16px; /* 컨테이너 좌우 패딩과 맞추기 위한 예시 (필요시 조정) */

  @media (max-width: 768px) {
    font-size: 0.8125rem; /* 13px */
    margin-bottom: 20px;
    padding-left: 10px; /* 모바일용 패딩 */
    padding-right: 10px; /* 모바일용 패딩 */
  }
`;

const KeywordsList = styled.div`
  display: flex;
  overflow-x: auto; /* 가로 스크롤 활성화 */
  /* flex-wrap: nowrap; /* 기본값이지만 명시적으로 둘 수도 있음 */
  gap: 16px; /* 아이템 간의 가로 간격 */
  padding: 0 16px 10px 16px; /* 좌우 패딩 및 하단 패딩 (스크롤바 영역 고려, 현재는 숨김) */

  /* 스크롤바 숨기기 (동작은 유지) */
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */

  @media (max-width: 768px) {
    gap: 12px; /* 모바일용 가로 간격 */
    padding: 0 10px 8px 10px; /* 모바일용 패딩 */
  }
`;

const KeywordPillLink = styled(Link)`
  /* display: inline-block; /* Flex 아이템으로 동작하므로 이 속성은 직접적인 영향이 줄어듦 */
  flex-shrink: 0; /* 중요: 아이템이 부모 컨테이너에 맞춰 줄어들지 않도록 함 */
  padding: 10px 22px; /* 내부 여백 조정 */
  font-size: 0.875rem; /* 14px */
  font-weight: 500; /* Medium */
  color: black; /* 밝은 회색/하늘색 계열 텍스트 (다크 테마) */
  background-color: white; /* 어두운 차콜/네이비 배경 */
  border: 1px solid #303742; /* 배경보다 약간 밝은 테두리 */
  border-radius: 50px; /* 완전한 알약 형태 */
  text-decoration: none;
  white-space: nowrap; /* 키워드 텍스트 자체가 길 경우 줄바꿈 방지 */
  transition: all 0.2s ease-in-out;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); /* 기본 그림자 효과로 입체감 */
  cursor: pointer;

  &:hover,
  &:focus {
    /* 호버 및 포커스 시 스타일 */
    color: #ffffff; /* 흰색 텍스트로 강조 */
    background-image: linear-gradient(
      145deg,
      #3d4a80,
      #533a71
    ); /* 깊은 인디고에서 자수정으로 이어지는 그라데이션 */
    border-color: #6a75d9; /* 밝은 인디고/퍼플 테두리 (은은한 빛 효과) */
    transform: translateY(-2px) scale(1.03); /* 살짝 위로 떠오르며 커지는 효과 */
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3),
      /* 더 깊은 그림자 */ 0 0 20px rgba(90, 100, 200, 0.3); /* 색상 있는 글로우 효과 */
    outline: none; /* 포커스 시 기본 아웃라인 제거 */
  }

  &:active {
    /* 클릭 시 스타일 */
    transform: translateY(0px) scale(1); /* 원래 위치와 크기로 복귀 */
    background-image: linear-gradient(
      145deg,
      #2c3a6f,
      #422a60
    ); /* 약간 더 어두운 그라데이션 */
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); /* 기본 그림자로 복귀 */
  }

  @media (max-width: 768px) {
    padding: 8px 18px;
    font-size: 0.8125rem; /* 13px */
  }
`;

// --- 컴포넌트 로직 (이전과 동일) ---

/**
 * 추천 키워드를 표시하는 컴포넌트
 * @param {object} props
 * @param {string[]} props.keywords - 추천 키워드 문자열 배열 (API 응답의 data 필드)
 * @param {string} [props.currentKeyword] - 현재 검색된 키워드 (추천 목록에서 제외하기 위함)
 */
const RecommendedKeywords = ({ keywords, currentKeyword }) => {
  if (!keywords || keywords.length === 0) {
    return null;
  }

  const filteredKeywords = currentKeyword
    ? keywords.filter((k) => k.toLowerCase() !== currentKeyword.toLowerCase())
    : keywords;

  if (filteredKeywords.length === 0) {
    return null;
  }

  return (
    <>
      {/* <GlobalStyle /> */} {/* 폰트 전역 설정이 필요하다면 주석 해제 */}
      <KeywordsContainer aria-labelledby="recommended-keywords-title">
        <KeywordsTitle id="recommended-keywords-title">
          이런 검색어는 어떠세요?
        </KeywordsTitle>
        <KeywordsList>
          {filteredKeywords.map((keyword, index) => (
            <KeywordPillLink
              key={`${keyword}-${index}`}
              to={`/view-news/${encodeURIComponent(keyword)}`}
              title={`${keyword} 관련 뉴스 보기`}
            >
              {keyword}
            </KeywordPillLink>
          ))}
        </KeywordsList>
      </KeywordsContainer>
    </>
  );
};

export default RecommendedKeywords;
