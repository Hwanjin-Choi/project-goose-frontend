import React, { useEffect, useState } from "react";
import styled from "styled-components";
import MainSearchInput from "../../components/MainSearchInput/MainSearchInput";
import { useSelector, useDispatch } from "react-redux";
import { setKeyword, clearKeyword } from "../../redux/keyword/keywordSlice";
import useMobileDetect from "../../hook/useMobileDetect";
import { useParams, useNavigate } from "react-router-dom";
import { resetNewsState } from "../../redux/news/newsSlice";
import { resetKeywordState } from "../../redux/recommend/recommendSlice";
import RecommendedKeywords from "../../components/RecommendKeywords/RecommendKeywords";
import InfiniteScrollController from "../../components/InfiniteScrollController/infiniteScrollController";
const ViewNewsPageWrapper = styled.div`
  gap: 10px;
  box-sizing: border-box;
  width: 100%;
  min-height: calc(100vh - ${"68px"} /* 헤더 높이 제외 */);
`;

const SearchInputWrapper = styled.div`
  width: 100%;
  max-width: 584px;
  padding-bottom: 10px;
`;

const ViewNewsPage = () => {
  const { keyword: urlKeyword } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isMobile = useMobileDetect();

  const [localSearchTerm, setLocalSearchTerm] = useState(urlKeyword || "");

  const { keywordList: recommendedKeywordsList, status: recommendStatus } =
    useSelector((state) => state.recommend);
  const isAuthenticated = useSelector((state) => state.token.isAuthenticated);

  // Effect 1: urlKeyword 변경에 따른 Redux 상태 동기화 및 UI 업데이트
  useEffect(() => {
    window.scrollTo(0, 0);
    if (urlKeyword) {
      dispatch(resetNewsState());
      dispatch(resetKeywordState());
      dispatch(setKeyword(urlKeyword));
      setLocalSearchTerm(urlKeyword);
    } else {
      dispatch(clearKeyword());
      dispatch(resetNewsState());
      dispatch(resetKeywordState());
      setLocalSearchTerm("");
    }
  }, [dispatch, urlKeyword]);

  // Effect 2: 컴포넌트 언마운트 시 전역 키워드 정리
  useEffect(() => {
    return () => {
      dispatch(clearKeyword());
    };
  }, [dispatch]);
  const handleInputChange = (event) => {
    setLocalSearchTerm(event.target.value);
  };

  const handleSearch = (query) => {
    const trimmedQuery = query.trim();
    if (trimmedQuery) {
      navigate(`/view-news/${trimmedQuery}`);
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
            placeholder="관심 있는 뉴스를 검색해 보세요"
          />
        </SearchInputWrapper>
      )}

      <RecommendedKeywords
        keywords={recommendedKeywordsList}
        currentKeyword={urlKeyword}
        recommendStatus={recommendStatus}
        isAuthenticated={isAuthenticated}
      />

      {urlKeyword ? (
        <InfiniteScrollController />
      ) : (
        <p style={{ textAlign: "center" }}>검색어를 URL에 입력해주세요.</p>
      )}
    </ViewNewsPageWrapper>
  );
};

export default ViewNewsPage;
