import React, { useState } from "react";
import MainSearchInput from "../../components/MainSearchInput/MainSearchInput";
import styled from "styled-components";
import Goose from "../../assets/Goose.png";
import PackedBubbleChart from "../../components/WordCloud/WordCloud";
import { setKeyword } from "../../redux/keyword/keywordSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

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
  { name: "선거일정", value: 1, category: "Language" },
  { name: "유튜브", value: 4, category: "Language" },
  { name: "사과", value: 5, category: "Language" },
  { name: "키보드", value: 6, category: "Language" },
  { name: "레고", value: 7, category: "Language" },
  { name: "안마기", value: 10, category: "Language" },
];

const LandingPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const searchKeyword = useSelector((state) => state.keyword.searchText);
  const dispatch = useDispatch();
  const naviagte = useNavigate();

  const handleInputChange = (event) => {
    /* setSearchTerm(event.target.value); */
    dispatch(setKeyword(event.target.value));
  };

  const handleSearch = (query) => {
    dispatch(setKeyword(query));
    naviagte(`/view-news/${query}`);
  };

  return (
    <LandingPageContainer>
      <StyledImage src={Goose} alt="Goose Logo" />
      <MainSearchInput
        value={searchKeyword}
        onChange={handleInputChange}
        onSearch={handleSearch}
        placeholder="오늘의 뉴스는"
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "50vh",
          width: "100%",
        }}
      >
        {}
        <div
          style={{
            flex: 1,
            border: "1px solid #eee",
            position: "relative",
          }}
        >
          <PackedBubbleChart dataFromServer={sampleData} />
        </div>
      </div>
    </LandingPageContainer>
  );
};

export default LandingPage;
