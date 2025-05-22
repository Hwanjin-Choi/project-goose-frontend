import React, { use, useEffect, useState } from "react";
import styled from "styled-components";
import MainSearchInput from "../../components/MainSearchInput/MainSearchInput"; // MainSearchInput 임포트
import { getNewsApi } from "../../api/News/fetchNews";
import InfiniteScrollController from "../../components/InfiniteScrollController/InfiniteScrollController";
import { useSelector, useDispatch } from "react-redux";
import { setKeyword, clearKeyword } from "../../redux/keyword/keywordSlice";
import useMobileDetect from "../../hook/useMobileDetect";
import { useParams, useNavigate } from "react-router-dom";
import { resetNewsState } from "../../redux/news/newsSlice";
import RecommendedKeywords from "../../components/RecommendKeywords/RecommendKeywords";
// 페이지 전체를 감싸는 Wrapper
const ViewNewsPageWrapper = styled.div`
  gap: 10px;
  box-sizing: border-box;
  width: 100%;
  min-height: calc(100vh - ${"68px"} /* 헤더 높이 제외 */);
`;

// MainSearchInput을 감싸는 Wrapper (중앙 정렬 및 너비 조절)
const SearchInputWrapper = styled.div`
  width: 100%;
  max-width: 584px; /* MainSearchInput의 기본 max-width와 유사하게 설정 */
  padding-bottom: 10px; /* 검색창 상하 패딩 */
`;

// 뉴스 카드들을 감싸는 컨테이너
const NewsCardsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px; /* 뉴스 카드 사이의 간격 */
  width: 100%;
  align-items: center;
`;
const data = ["두산", "경기", "서울", "랜더", "베어스"];
const ViewNewsPage = () => {
  const { keyword: urlKeyword } = useParams(); // URL에서 :keyword 값을 가져옴 (명확성을 위해 urlKeyword로 명명)
  const dispatch = useDispatch();
  const navigate = useNavigate(); // 페이지 내 검색 시 URL 변경을 위해
  const isMobile = useMobileDetect();

  // ViewNewsPage 내의 검색창을 위한 로컬 상태
  const [localSearchTerm, setLocalSearchTerm] = useState(urlKeyword || "");

  useEffect(() => {
    window.scrollTo(0, 0);

    if (urlKeyword) {
      console.log("ViewNewsPage: URL 키워드 감지 ->", urlKeyword);
      dispatch(resetNewsState());
      dispatch(setKeyword(urlKeyword));
      setLocalSearchTerm(urlKeyword);
    } else {
      dispatch(clearKeyword());
      dispatch(resetNewsState());
      setLocalSearchTerm("");
    }

    return () => {
      dispatch(clearKeyword());
    };
  }, [dispatch, urlKeyword]); // urlKeyword가 바뀔 때마다 이 로직이 실행되도록 합니다.

  const handleInputChange = (event) => {
    setLocalSearchTerm(event.target.value);
  };

  // ViewNewsPage 내의 검색창에서 검색을 실행했을 때
  const handleSearch = (query) => {
    const trimmedQuery = query.trim();
    if (trimmedQuery) {
      // URL을 변경하여, 위의 useEffect 로직을 통해 전체 데이터 로딩 흐름을 다시 시작합니다.
      // 이렇게 하면 URL이 항상 현재 검색 상태를 반영하게 됩니다.
      navigate(`/view-news/${trimmedQuery}`);
    }
  };

  return (
    <ViewNewsPageWrapper>
      {isMobile && (
        <SearchInputWrapper>
          <MainSearchInput
            value={localSearchTerm} // 로컬 상태 사용
            onChange={handleInputChange}
            onSearch={handleSearch}
            placeholder="관심 있는 뉴스를 검색해 보세요"
          />
        </SearchInputWrapper>
      )}

      <RecommendedKeywords keywords={data} currentKeyword={urlKeyword} />
      {urlKeyword ? (
        <InfiniteScrollController />
      ) : (
        <p style={{ textAlign: "center" }}>검색어를 URL에 입력해주세요.</p>
      )}
    </ViewNewsPageWrapper>
  );
};

export default ViewNewsPage;
