import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import MainSearchInput from "../../components/MainSearchInput/MainSearchInput";
import useMobileDetect from "../../hook/useMobileDetect";

import InfiniteScrollController from "../../components/InfiniteScrollController/InfiniteScrollController";

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
const ViewScrapedNewsPage = () => {
  const { keyword: urlKeyword } = useParams(); // URL에서 :keyword 값을 가져옴 (명확성을 위해 urlKeyword로 명명)
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
      //dispatch(clearKeyword());
      //dispatch(resetNewsState());
      setLocalSearchTerm("");
    }

    return () => {
      //dispatch(clearKeyword());
    };
  }, [dispatch, urlKeyword]); // urlKeyword가 바뀔 때마다 이 로직이 실행되도록 합니다.

  const handleInputChange = (event) => {
    setLocalSearchTerm(event.target.value);
  };

  const handleSearch = (query) => {
    const trimmedQuery = query.trim();
    if (trimmedQuery) {
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
            placeholder="스크랩 된 기사를 키워드로 빨리 찾아보세요"
          />
        </SearchInputWrapper>
      )}

      <InfiniteScrollController mode="scraped" />
    </ViewNewsPageWrapper>
  );
};

export default ViewScrapedNewsPage;
