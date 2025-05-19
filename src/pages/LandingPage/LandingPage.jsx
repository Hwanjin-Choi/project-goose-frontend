import React, { useState } from "react";
import MainSearchInput from "../../components/MainSearchInput/MainSearchInput";
import styled from "styled-components";
import Goose from "../../assets/Goose.png";
import PackedBubbleChart from "../../components/WordCloud/WordCloud";

const LandingPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  width: 100%;
  height: 100%;
`;

const StyledImage = styled.img`
  width: 200px;
  height: 200px;
`;
const sampleData = [
  { name: "심슨", value: 1, category: "Frontend" },
  { name: "야구", value: 2, category: "Visualization" },
  { name: "Youtube", value: 3, category: "Backend" },
  // ... 기타 샘플 데이터
  { name: "선거일정", value: 1, category: "Language" },
  { name: "유튜브", value: 4, category: "Language" },
  { name: "사과", value: 5, category: "Language" },
  { name: "키보드", value: 6, category: "Language" },
  { name: "레고", value: 7, category: "Language" },
  { name: "안마기", value: 10, category: "Language" },
];

const LandingPage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = (query) => {
    if (query.trim() !== "") {
      alert(`"${query}"(으)로 검색을 실행합니다!`);
    } else {
      alert("검색어를 입력해주십시오.");
    }
  };

  return (
    <LandingPageContainer>
      <StyledImage src={Goose} alt="Goose Logo" />
      <MainSearchInput
        value={searchTerm}
        onChange={handleInputChange}
        onSearch={handleSearch}
        placeholder="오늘의 뉴스는"
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "50vh" /* 예시: 헤더 등을 제외한 전체 화면 높이 */,
          width: "100%",
        }}
      >
        {/* 아래 div가 남은 공간을 차지하며, PackedBubbleChart는 이 div의 100%를 사용합니다. */}
        <div
          style={{
            flex: 1,
            border: "1px solid #eee",
            position: "relative" /* ResizeObserver 안정성을 위해 */,
          }}
        >
          <PackedBubbleChart dataFromServer={sampleData} />
        </div>
      </div>
    </LandingPageContainer>
  );
};

export default LandingPage;
