import React, { useState, useEffect } from "react";
import MainSearchInput from "../../components/MainSearchInput/MainSearchInput";
import styled from "styled-components";
import Goose from "../../assets/Goose.png";
import PackedBubbleChart from "../../components/WordCloud/WordCloud";
import { setKeyword } from "../../redux/keyword/keywordSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import useMobileDetect from "../../hook/useMobileDetect";
import { getTrendingKeywordList } from "../../redux/trending/trendingSlice";
import TrendingKeyword from "../../components/TrendingKeyword/TrendingKeyword";
const LandingPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  width: 100%;
  height: 100%;
`;

// 20 100 20 43  183px
const StyledImage = styled.img`
  width: 200px;
  height: 200px;
  padding: 20px;
  @media (max-width: 768px) {
    width: 100px;
    height: 100px;
    padding: 10px;
  }
`;
const WordCloudWrapper = styled.div`
  display: flex; // 내부 PackedBubbleChart가 flex 아이템처럼 동작하게 하기 위함 (선택적)
  flex-direction: column; // 내부 PackedBubbleChart가 수직으로 공간을 채우도록
  width: 100%;
  flex-grow: 1; /* 부모 Flex 컨테이너(LandingPageContainer)에서 남은 수직 공간을 모두 차지 */
  min-height: 0; /* flex 아이템이 콘텐츠 크기 때문에 부모를 넘어서는 것을 방지 (매우 중요!) */
  border: 1px solid #eee;
  position: "relative"; /* PackedBubbleChart 내부의 position:absolute 요소 기준점 */
`;

const sampleData1 = [
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
const sampleData = [
  { name: "심슨", value: 1 },
  { name: "야구", value: 3 },
  { name: "Youtube", value: 3 },
  { name: "선거일정", value: 2 },
  { name: "야구", value: 3 },

  { name: "선거일정", value: 2 },
  { name: "야구", value: 3 },
  { name: "Youtube", value: 3 },
  { name: "선거일정", value: 2 },
];

const LandingPage = () => {
  const currentKeyword = useSelector((state) => state.keyword.searchText);

  const dispatch = useDispatch();
  const naviagte = useNavigate();
  const params = useParams();
  const isMobile = useMobileDetect();
  const [searchTerm, setSearchTerm] = useState(params.keyword);
  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
    /* dispatch(setKeyword(event.target.value)); */
  };

  const handleSearch = (query) => {
    dispatch(setKeyword(query));
    naviagte(`/view-news/${query}`);
  };

  useEffect(() => {
    setSearchTerm(params.keyword);
  }, [params.keyword]);

  useEffect(() => {
    const fetchTrendingKeyword = async () => {
      try {
        await dispatch(getTrendingKeywordList());
      } catch (error) {
        console.log(error);
      }
    };

    fetchTrendingKeyword();
  }, []);

  return (
    <LandingPageContainer>
      <StyledImage src={Goose} alt="Goose Logo" />
      <MainSearchInput
        value={searchTerm}
        onChange={handleInputChange}
        onSearch={handleSearch}
        placeholder="오늘의 뉴스는?"
      />
      <TrendingKeyword />
    </LandingPageContainer>
  );
};

export default LandingPage;
