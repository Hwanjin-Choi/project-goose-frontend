import React, { use, useState } from "react";
import styled from "styled-components";
import { NewsCard } from "../../components/NewsCard/NewsCard";
import MainSearchInput from "../../components/MainSearchInput/MainSearchInput"; // MainSearchInput 임포트
import { getNewsApi } from "../../api/News/fetchNews";
import NewsCardSkeleton from "../../components/NewsCardSkeleton/NewsCardSkeleton";
import { useSelector, useDispatch } from "react-redux";
import { setKeyword } from "../../redux/keyword/keywordSlice";
import useMobileDetect from "../../hook/useMobileDetect";

// 샘플 뉴스 데이터 (배열 형태로 여러 개를 관리하도록 수정)
const sampleNewsDataArray = [
  {
    id: 1,
    title: "코카인 숨긴 마크롱?…엘리제궁 &quot;코 푼 <b>휴지</b>였다&quot;",
    originallink: "https://www.yna.co.kr/view/AKR20250513133500081?input=1195m",
    link: "https://n.news.naver.com/mnews/article/001/0015385869?sid=104",
    description:
      "루머가 삽시간에 퍼지자 엘리제궁은 11일 엑스(X·옛 트위터) 계정에 이 흰색 물질을 확대한 사진을 올리며 &quot;이건 코 풀 때 쓰는 <b>휴지</b>&quot;라고 반박했다. 엘리제궁은 &quot;유럽의 단결이 거슬리면 허위 정보는 단순한 <b>휴지</b>를... 대통령의 건강을 해치려는 악의적인 시도에 불과하다&quot;고 덧붙였다. 마크롱 대통령은 최근 유럽의회 선거 패배 이후 정치적 격변을 겪고 있으며, 이러한 루머는 그의 이미지를 더욱 손상시킬 수 있다.",
    pubDate: "Tue, 13 May 2025 17:16:00 +0900",
  },
  {
    id: 2,
    title: "두 번째 뉴스 제목입니다. <b>중요</b> 키워드 포함!",
    originallink: "https://example.com/news2",
    link: "https://example.com/news2-naver",
    description:
      "이것은 두 번째 뉴스의 설명입니다. 다양한 <b>정보</b>를 포함하고 있으며, 사용자에게 유익한 내용을 전달하려고 합니다. 상세 내용은 링크를 통해 확인해 주십시오.",
    pubDate: "Wed, 14 May 2025 10:30:00 +0900",
  },
  {
    id: 3,
    title: "세 번째 뉴스, <b>IT</b> 기술 동향 분석",
    originallink: "https://example.com/news3",
    link: "https://example.com/news3-naver",
    description:
      "최신 <b>IT</b> 기술 동향을 심층 분석한 기사입니다. 인공지능, 클라우드 컴퓨팅 등 다양한 주제를 다루고 있습니다. 미래 기술에 관심 있는 분들께 추천합니다.",
    pubDate: "Thu, 15 May 2025 14:00:00 +0900",
  },
  // 필요에 따라 더 많은 뉴스 아이템 추가
];

// 페이지 전체를 감싸는 Wrapper
const ViewNewsPageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center; /* 내부 요소들을 가로축 중앙 정렬 */
  gap: 30px; /* 검색창과 뉴스 카드 컨테이너 사이의 간격 */
  box-sizing: border-box;
  width: 100%;
  min-height: calc(100vh - ${"68px"} /* 헤더 높이 제외 */);
`;

// MainSearchInput을 감싸는 Wrapper (중앙 정렬 및 너비 조절)
const SearchInputWrapper = styled.div`
  width: 100%;
  max-width: 584px; /* MainSearchInput의 기본 max-width와 유사하게 설정 */
  padding: 20px 0; /* 검색창 상하 패딩 */
`;

// 뉴스 카드들을 감싸는 컨테이너
const NewsCardsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px; /* 뉴스 카드 사이의 간격 */
  width: 100%;
  align-items: center;
`;

const ViewNewsPage = () => {
  const currentKeyword = useSelector((state) => state.keyword.searchText);
  const [searchTerm, setSearchTerm] = useState(currentKeyword);
  const [isLoading, setIsLoading] = useState(true);

  const dispatch = useDispatch();
  const isMobile = useMobileDetect();

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = async (query) => {
    dispatch(setKeyword(query));
    const res = await getNewsApi();
    console.log(res);
  };

  return (
    <ViewNewsPageWrapper>
      {isMobile && (
        <SearchInputWrapper>
          <MainSearchInput
            value={searchTerm}
            onChange={handleInputChange}
            onSearch={handleSearch}
            placeholder="관심 있는 뉴스를 검색해 보세요"
          />
        </SearchInputWrapper>
      )}

      <NewsCardsContainer>
        {sampleNewsDataArray.map((newsItem) => (
          <NewsCard key={newsItem.id} newsItem={newsItem} />
        ))}

        {isLoading && (
          <>
            {[...Array(3)].map(
              (
                _,
                index // 다음 3개에 대한 스켈레톤
              ) => (
                <NewsCardSkeleton key={`skeleton-${index}`} />
              )
            )}
          </>
        )}
      </NewsCardsContainer>
    </ViewNewsPageWrapper>
  );
};

export default ViewNewsPage;
