import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import useMobileDetect from "../../hook/useMobileDetect";
import { setKeyword, clearKeyword } from "../../redux/keyword/keywordSlice";
import MainSearchInput from "../../components/MainSearchInput/MainSearchInput";
import InfiniteScrollController from "../../components/InfiniteScrollController/InfiniteScrollController";
import {
  getScrapedNewsByParam,
  resetScrapedNewsState,
} from "../../redux/scrapedNews/scrapedNewsSlice";

// 페이지 전체를 감싸는 Wrapper
const ViewNewsPageWrapper = styled.div`
  gap: 10px;
  box-sizing: border-box;
  width: 100%;
  min-height: calc(100vh - ${"68px"});
`;

// MainSearchInput을 감싸는 Wrapper (중앙 정렬 및 너비 조절 + 중앙 정렬 스타일)
const SearchInputWrapper = styled.div`
  width: 100%;
  max-width: 584px;
  margin: 0 auto;
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
    dispatch(clearKeyword());

    if (urlKeyword) {
      dispatch(setKeyword(urlKeyword));
      setLocalSearchTerm(urlKeyword);
    } else {
      dispatch(setKeyword(""));
      setLocalSearchTerm("");

      dispatch(
        getScrapedNewsByParam({
          keyword: null,
          offset: 1,
          limit: 10,
        })
      );
    }
  }, [dispatch, urlKeyword]);

  useEffect(() => {
    return () => {
      dispatch(clearKeyword());
      dispatch(resetScrapedNewsState());
    };
  }, [dispatch]);

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
      <SearchInputWrapper>
        <MainSearchInput
          value={localSearchTerm}
          onChange={handleInputChange}
          onSearch={handleSearch}
          placeholder="스크랩 된 기사를 키워드로 빠르게 찾아보세요"
        />
      </SearchInputWrapper>

      <InfiniteScrollController mode="scraped" />
    </ViewNewsPageWrapper>
  );
};

export default ViewScrapedNewsPage;
