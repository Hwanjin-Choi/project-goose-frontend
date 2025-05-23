import React, { useState, useEffect } from "react";

import PackedBubbleChart from "../../components/WordCloud/WordCloud";

import { useSelector } from "react-redux";
import useMobileDetect from "../../hook/useMobileDetect";
import styled, { keyframes } from "styled-components";
import noKeywordGooseImg from "../../assets/nokeywordgoose.png";
// 가변 높이를 위한 TrendingKeywordContainer 수정
const TrendingKeywordContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center; /* 로딩 및 에러 메시지 중앙 정렬을 위해 추가 */
  justify-content: center; /* 로딩 및 에러 메시지 중앙 정렬을 위해 추가 */
  width: 100%;
  /* isMobile prop을 받아 높이를 동적으로 설정합니다. */
  height: ${(props) =>
    props.isMobile ? "calc(100vh - 260px)" : "calc(100vh - 360px)"};
  text-align: center; /* 내부 텍스트 중앙 정렬 */
`;

// 로딩 스피너를 위한 keyframes 정의
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
const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const LoadingText = styled.h4`
  color: #555; /* 로딩 텍스트 색상 */
`;

// 에러 메시지 스타일링 (선택 사항)
const ErrorMessage = styled.h4`
  color: #d8000c; /* 에러 메시지 색상 */
  background-color: #ffd2d2; /* 에러 메시지 배경색 */
  padding: 10px 20px;
  border-radius: 5px;
  border: 1px solid #d8000c;
`;

// 에러 메시지 스타일링 (선택 사항)
const NoKeywordMessage = styled.h4`
  color: #78af4c; /* 에러 메시지 색상 */
  background-color: #white; /* 에러 메시지 배경색 */
  padding: 10px 20px;
  border-radius: 5px;
`;
const NoKeywordImg = styled.img`
  width: 200px;
  height: 200px;
  padding: 10px;
`;
const NoKeywordContainer = styled.div`
  padding: 10px;
`;

const sampleData = [
  { keyword: "지진", count: 120 },
  { keyword: "부동산 정책", count: 48 },
  { keyword: "AI 기술", count: 45 },
  { keyword: "저출생 대책", count: 42 },
  { keyword: "소비자 물가", count: 39 },
  { keyword: "기후변화", count: 38 },
  { keyword: "북한 미사일", count: 37 },
  { keyword: "주식 시장", count: 35 },
  { keyword: "반도체", count: 33 },
  { keyword: "의료개혁", count: 32 },
  { keyword: "손흥민", count: 30 },
  { keyword: "사이버 보안", count: 29 },
  { keyword: "원달러 환율", count: 28 },
  { keyword: "전기차 보조금", count: 27 },
  { keyword: "고령화 사회", count: 26 },
  { keyword: "비트코인", count: 22 },
  { keyword: "선거", count: 21 },
  { keyword: "가계부채", count: 20 },
  { keyword: "양자컴퓨팅", count: 19 },
  { keyword: "인구감소", count: 18 },
  { keyword: "로봇 산업", count: 17 },
  { keyword: "이정후", count: 16 },
  { keyword: "기준금리", count: 15 },
  { keyword: "북한 신형 구축함", count: 14 },
  { keyword: "공매도 현황", count: 12 },
  { keyword: "산사태", count: 10 },
  { keyword: "노령연금", count: 8 },
];

const TrendingKeyword = () => {
  const isMobile = useMobileDetect();

  const { status: trendingKeywordStatus, keywordList } = useSelector(
    (state) => state.trending
  );

  return (
    <>
      {/* isMobile prop을 TrendingKeywordContainer에 전달합니다. */}
      <TrendingKeywordContainer isMobile={isMobile}>
        {trendingKeywordStatus === "loading" ? (
          <LoadingContainer>
            <Spinner />
            <LoadingText>잠시만 기다려 주십시오...</LoadingText>
          </LoadingContainer>
        ) : trendingKeywordStatus === "succeeded" ? (
          <PackedBubbleChart dataFromServer={keywordList} />
        ) : keywordList.length === 0 ? (
          <>
            <NoKeywordContainer>
              <NoKeywordImg src={noKeywordGooseImg} />
              <NoKeywordMessage>
                현재 집계된 키워드가 아직 부족합니다
              </NoKeywordMessage>
            </NoKeywordContainer>
          </>
        ) : trendingKeywordStatus === "failed" ? ( // 'failed' 상태를 명시적으로 처리
          <ErrorMessage>
            데이터를 불러오는 데 실패했습니다. 다시 시도해 주십시오.
          </ErrorMessage>
        ) : (
          <ErrorMessage>알 수 없는 오류가 발생했습니다.</ErrorMessage> // 예외적인 다른 상태 처리
        )}
      </TrendingKeywordContainer>
    </>
  );
};

export default TrendingKeyword;
