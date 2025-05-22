import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import useMobileDetect from "../../hook/useMobileDetect";

import MainSearchInput from "../../components/MainSearchInput/MainSearchInput";
import InfiniteScrollController from "../../components/InfiniteScrollController/InfiniteScrollController";
import { resetScrapedNewsState } from "../../redux/scrapedNews/scrapedNewsSlice";

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
  max-width: 584px;
  padding-bottom: 10px;
`;

const ViewScrapedNewsPage = () => {
  const { keyword: urlKeyword } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isMobile = useMobileDetect();

  const [localSearchTerm, setLocalSearchTerm] = useState(urlKeyword || "");

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(resetScrapedNewsState());

    if (urlKeyword) {
      setLocalSearchTerm(urlKeyword);
    } else {
      setLocalSearchTerm("");
    }
  }, [dispatch, urlKeyword]);

  const handleInputChange = (event) => {
    setLocalSearchTerm(event.target.value);
  };

  const handleSearch = (query) => {
    const trimmedQuery = query.trim();
    if (trimmedQuery) {
      navigate(`/scrap/${trimmedQuery}`);
    }
  };

  return (
    <ViewNewsPageWrapper>
      {isMobile && (
        <SearchInputWrapper>
          <MainSearchInput
            value={localSearchTerm}
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
