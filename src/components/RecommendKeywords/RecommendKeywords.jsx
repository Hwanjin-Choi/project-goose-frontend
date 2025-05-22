import React from "react";
import { Link } from "react-router-dom";
import styled, { keyframes } from "styled-components";

// --- 스타일 정의 (기존 스타일 유지 또는 필요시 수정) ---
const KeywordsContainer = styled.section`
  padding: 20px 0; /* 패딩 조정 */
  margin-bottom: 24px;
  border-top: 1px solid #2a2f37;
  border-bottom: 1px solid #2a2f37;

  @media (max-width: 768px) {
    padding: 12px 0;
    margin-bottom: 12px;
  }
`;

const KeywordsTitle = styled.h3`
  font-size: 1.1rem; /* 약간 크게 */
  font-weight: 600;
  color: black; /* 밝은 회색으로 변경 (다크 테마 가정) */
  /* text-transform: uppercase; */ /* 대문자 변환 제거 또는 취향에 따라 유지 */
  letter-spacing: 0.025em; /* 자간 약간 줄임 */
  margin-bottom: 20px;
  text-align: left;
  padding-left: 16px;
  padding-right: 16px;

  @media (max-width: 768px) {
    font-size: 0.9rem;
    margin-bottom: 16px;
    padding-left: 10px;
    padding-right: 10px;
  }
`;

const KeywordsList = styled.div`
  display: flex;
  overflow-x: auto;
  gap: 12px; /* 간격 약간 줄임 */
  padding: 0 16px 10px 16px;

  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;

  @media (max-width: 768px) {
    gap: 10px;
    padding: 0 10px 8px 10px;
  }
`;

const KeywordPillLink = styled(Link)`
  flex-shrink: 0;
  padding: 8px 18px; /* 패딩 약간 줄임 */
  font-size: 0.875rem;
  font-weight: 500;
  color: #e2e8f0; /* 밝은 텍스트 색상 */
  background-color: #2d3748; /* 어두운 배경 */
  border: 1px solid #4a5568; /* 테두리 */
  border-radius: 50px;
  text-decoration: none;
  white-space: nowrap;
  transition: all 0.2s ease-in-out;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  cursor: pointer;

  &:hover,
  &:focus {
    color: #ffffff;
    background-color: #4a5568; /* 호버 시 배경 변경 */
    border-color: #718096;
    transform: translateY(-1px) scale(1.02);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.25);
    outline: none;
  }

  &:active {
    transform: translateY(0px) scale(1);
    background-color: #2c3a6f;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  }

  @media (max-width: 768px) {
    padding: 7px 16px;
    font-size: 0.8125rem;
  }
`;

// --- 로딩 스피너 스타일 ---
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const Spinner = styled.div`
  border: 4px solid #4a5568; /* 스피너 트랙 색상 (테두리 색상과 유사하게) */
  border-top: 4px solid #cbd5e1; /* 스피너 활성 부분 색상 (텍스트 색상과 유사하게) */
  border-radius: 50%;
  width: 24px; /* 스피너 크기 */
  height: 24px;
  animation: ${spin} 1s linear infinite;
  margin: 6px 0; /* 스피너를 수직 중앙에 위치시키기 위한 마진 (Pill 높이 고려) */
`;

const LoadingContainer = styled(KeywordsList)`
  /* KeywordsList 스타일 상속하여 flex 정렬 유지 */
  align-items: center; /* 스피너를 수직 중앙 정렬 */
  min-height: 48px; /* 스피너 표시를 위한 최소 높이 (Pill 높이와 유사하게) */
`;

const MessageContainer = styled.div`
  padding: 20px 16px;
  text-align: center;
  color: #9ca3af; /* 부드러운 메시지 색상 */
  font-size: 0.9rem;
`;

/**
 * 추천 키워드를 표시하는 컴포넌트
 * @param {object} props
 * @param {string[]} props.keywords - 추천 키워드 목록 (recommendSlice.keywordList)
 * @param {string} [props.currentKeyword] - 현재 검색된 뉴스 키워드 (urlKeyword)
 * @param {'idle' | 'loading' | 'succeeded' | 'failed'} props.recommendStatus - 추천 키워드 API 호출 상태
 * @param {boolean} props.isAuthenticated - 사용자 인증 상태
 */
const RecommendedKeywords = ({
  keywords = [],
  currentKeyword,
  recommendStatus,
  isAuthenticated,
}) => {
  // 로딩 조건: 사용자가 로그인했고, 현재 검색한 키워드가 있으며,
  // 1. 추천 키워드 API가 로딩 중이거나
  // 2. 또는 API 상태가 'idle'이고 아직 로드된 키워드가 없을 때 (초기 지연 또는 리셋 후 상태)
  const isLoading =
    isAuthenticated &&
    currentKeyword &&
    (recommendStatus === "loading" ||
      (recommendStatus === "idle" && keywords.length === 0));

  if (!isAuthenticated || !currentKeyword) {
    // 로그인하지 않았거나, 현재 검색된 뉴스가 없으면(urlKeyword가 없으면) 아무것도 표시하지 않음
    return null;
  }

  if (isLoading) {
    return (
      <KeywordsContainer aria-live="polite" aria-busy="true">
        <KeywordsTitle id="recommended-keywords-title">
          추천 검색어를 로딩중입니다!
        </KeywordsTitle>
        {/* 스켈레톤 대신 스피너 하나를 중앙에 표시 */}
        <LoadingContainer style={{ justifyContent: "center" }}>
          <Spinner />
        </LoadingContainer>
      </KeywordsContainer>
    );
  }

  if (recommendStatus === "failed") {
    return (
      <KeywordsContainer>
        <KeywordsTitle id="recommended-keywords-title">
          추천 키워드
        </KeywordsTitle>
        <MessageContainer>
          추천 키워드를 불러오는 데 실패했습니다.
        </MessageContainer>
      </KeywordsContainer>
    );
  }

  // 'succeeded' 상태이거나, 'idle'이지만 이미 keywords가 있는 경우 (예: 이전 검색 결과)
  if (
    recommendStatus === "succeeded" ||
    (recommendStatus === "idle" && keywords.length > 0)
  ) {
    const filteredKeywords = currentKeyword
      ? keywords.filter(
          (k) => k && k.toLowerCase() !== currentKeyword.toLowerCase()
        ) // k가 존재하는지 확인
      : keywords.filter((k) => k); // k가 존재하는지 확인

    if (filteredKeywords.length === 0) {
      // 성공적으로 가져왔지만, 현재 키워드를 제외하고 보여줄 추천 키워드가 없는 경우
      return (
        <KeywordsContainer>
          <KeywordsTitle id="recommended-keywords-title">
            이런 검색어는 어떠세요?
          </KeywordsTitle>
          <MessageContainer>현재 다른 추천 검색어가 없습니다.</MessageContainer>
        </KeywordsContainer>
      );
    }

    return (
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
    );
  }

  // 그 외의 경우
  return null;
};

export default RecommendedKeywords;
