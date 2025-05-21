import React, { use, useEffect, useState } from "react";
import styled from "styled-components";
import MainSearchInput from "../../components/MainSearchInput/MainSearchInput"; // MainSearchInput 임포트
import { getNewsApi } from "../../api/News/fetchNews";
import InfiniteScrollController from "../../components/InfiniteScrollController/InfiniteScrollController";
import { useSelector, useDispatch } from "react-redux";
import { setKeyword } from "../../redux/keyword/keywordSlice";
import useMobileDetect from "../../hook/useMobileDetect";
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

  const dispatch = useDispatch();
  const isMobile = useMobileDetect();

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = async (query) => {
    dispatch(setKeyword(query));
    const res = await getNewsApi();
  };
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
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
      <InfiniteScrollController />
    </ViewNewsPageWrapper>
  );
};

export default ViewNewsPage;
