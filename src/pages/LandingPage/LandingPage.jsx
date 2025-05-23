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
  { name: "지진", value: 60 }, // 가장 높은 값으로 설정
  { name: "부동산 정책", value: 48 },
  { name: "AI 기술", value: 45 },
  { name: "저출생 대책", value: 42 },
  { name: "소비자 물가", value: 39 },
  { name: "기후변화", value: 38 },
  { name: "북한 미사일", value: 37 },
  { name: "주식 시장", value: 35 },
  { name: "반도체", value: 33 },
  { name: "의료개혁", value: 32 },
  { name: "손흥민", value: 30 },
  { name: "사이버 보안", value: 29 },
  { name: "원달러 환율", value: 28 },
  { name: "전기차 보조금", value: 27 },
  { name: "고령화 사회", value: 26 },
  { name: "이재명", value: 25 },
  { name: "미세먼지 농도", value: 24 },
  { name: "해외여행", value: 23 },
  { name: "비트코인", value: 22 },
  { name: "선거", value: 21 },
  { name: "가계부채", value: 20 },
  { name: "양자컴퓨팅", value: 19 },
  { name: "인구감소", value: 18 },
  { name: "로봇 산업", value: 17 },
  { name: "이정후", value: 16 },
  { name: "기준금리", value: 15 },
  { name: "북한 신형 구축함", value: 14 },
  { name: "공매도 현황", value: 12 },
  { name: "산사태", value: 10 },
  { name: "노령연금", value: 8 },
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
        console.log("Trending keywords fetched"); // 확인용 로그
      } catch (error) {
        console.error("Error fetching trending keywords:", error); // 에러 로깅 개선
      }
    };

    fetchTrendingKeyword();

    const intervalId = setInterval(fetchTrendingKeyword, 5000);

    return () => {
      clearInterval(intervalId);
      console.log("Interval cleared");
    };
  }, [dispatch]);

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
