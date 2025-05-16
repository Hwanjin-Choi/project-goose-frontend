import React, { useState } from "react";
import MainSearchInput from "../../components/MainSearchInput/MainSearchInput";
import styled from "styled-components";
import Goose from "../../assets/Goose.png";
import WorldCloudComponent from "../../components/WordCloud/WordCloud";

const LandingPageContainer = styled.div`
  padding: 50px 20px;
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

      <WorldCloudComponent />
    </LandingPageContainer>
  );
};

export default LandingPage;
