import React, { useState, useEffect } from "react";
import styled from "styled-components";

import PackedBubbleChart from "../../components/WordCloud/WordCloud";

import { useDispatch, useSelector } from "react-redux";
import useMobileDetect from "../../hook/useMobileDetect";
// import { getTrendingKeywordList } from "../../redux/trending/trendingSlice";

const WordCloudWrapper = styled.div`
  display: flex; // 내부 PackedBubbleChart가 flex 아이템처럼 동작하게 하기 위함 (선택적)
  flex-direction: column; // 내부 PackedBubbleChart가 수직으로 공간을 채우도록
  width: 100%;
  flex-grow: 1; /* 부모 Flex 컨테이너(LandingPageContainer)에서 남은 수직 공간을 모두 차지 */
  min-height: 0; /* flex 아이템이 콘텐츠 크기 때문에 부모를 넘어서는 것을 방지 (매우 중요!) */
  border: 1px solid #eee;
  position: "relative"; /* PackedBubbleChart 내부의 position:absolute 요소 기준점 */
`;

/* const TrendingKeywordContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    height : ${isMobile} ? calc(100vh - 260px) : calc(100vh - 360px);
`;
 */
const TrendingKeywordContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: calc(100vh - 260px);
`;

const TrendingKeywordComponent = () => {
  const isMobile = useMobileDetect();
  const dispatch = useDispatch();

  return (
    <>
      <TrendingKeywordContainer isMobile={isMobile}>
        {/* {trendingKeywordStatus === "loading" ? (
          <h4> Loading </h4>
        ) : trendingKeywordStatus === "succeeded" ? (
          <h4>Loaded</h4>
        ) : (
          <h4>Error</h4>
        )} */}
        <h4>test</h4>
      </TrendingKeywordContainer>
    </>
  );
};

export default TrendingKeywordComponent;
