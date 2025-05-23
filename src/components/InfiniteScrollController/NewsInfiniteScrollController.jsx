import { useEffect, useState, useRef } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { getNewsByParam, resetNewsState } from "../../redux/news/newsSlice";
import {
  getKeywordList,
  resetKeywordState,
} from "../../redux/recommend/recommendSlice";
import { NewsCard } from "../NewsCard/NewsCard";
import NewsCardSkeleton from "../NewsCardSkeleton/NewsCardSkeleton";

const NewsCardsContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  margin: 0 auto;
`;

const NEWS_START_INDEX = 1;
const NEWS_DISPLAY_INDEX = 10;
const KEYWORD_FETCH_DELAY = 1750;

const NewsInfiniteScrollController = () => {
  const dispatch = useDispatch();
  const keywordFetchTimeoutRef = useRef(null);
  const isFetchingRef = useRef(false);
  const prevKeywordRef = useRef(null);

  const currentKeyword = useSelector((state) => state.keyword.searchText);
  const isAuthenticated = useSelector((state) => state.token.isAuthenticated);
  const displayList = useSelector((state) => state.news.newsList);
  const status = useSelector((state) => state.news.status);
  const hasMore = useSelector((state) => state.news.hasMore);

  const [start, setStart] = useState(NEWS_START_INDEX);

  const fetchNewsData = async (isNewKeywordSearch = false) => {
    if (isFetchingRef.current) return;

    isFetchingRef.current = true;

    const offset = isNewKeywordSearch ? NEWS_START_INDEX : start;

    try {
      const action = await dispatch(
        getNewsByParam({
          keyword: currentKeyword,
          offset,
          limit: NEWS_DISPLAY_INDEX,
        })
      );

      // 뉴스 + 인증 유저인 경우에만 추천 키워드 딜레이 호출
      if (getNewsByParam.fulfilled.match(action) && isAuthenticated) {
        if (keywordFetchTimeoutRef.current) {
          clearTimeout(keywordFetchTimeoutRef.current);
        }
        keywordFetchTimeoutRef.current = setTimeout(() => {
          dispatch(getKeywordList());
          keywordFetchTimeoutRef.current = null;
        }, KEYWORD_FETCH_DELAY);
      }

      setStart(offset + NEWS_DISPLAY_INDEX);
    } catch (error) {
      console.error("뉴스 로딩 실패:", error);
    } finally {
      isFetchingRef.current = false;
    }
  };

  useEffect(() => {
    dispatch(resetNewsState());
    dispatch(resetKeywordState());
    setStart(NEWS_START_INDEX);
    prevKeywordRef.current = currentKeyword;
    fetchNewsData(true);

    return () => {
      if (keywordFetchTimeoutRef.current) {
        clearTimeout(keywordFetchTimeoutRef.current);
      }
    };
  }, [currentKeyword, dispatch]);

  const loadMoreNews = () => {
    if (status !== "loading" && hasMore) {
      fetchNewsData(false);
    }
  };

  return (
    <InfiniteScroll
      dataLength={displayList.length}
      next={loadMoreNews}
      hasMore={hasMore}
      loader={
        <NewsCardsContainer>
          <>
            {[...Array(3)].map((_, index) => (
              <NewsCardSkeleton key={`skeleton-${index}`} />
            ))}
          </>
        </NewsCardsContainer>
      }
      endMessage={
        displayList.length > 0 && !hasMore ? (
          <p style={{ textAlign: "center" }}>
            <b>더 이상 뉴스가 없습니다.</b>
          </p>
        ) : null
      }
      scrollThreshold={"70%"}
    >
      <NewsCardsContainer>
        {displayList.map((item, index) => (
          <NewsCard key={index} newsItem={item} />
        ))}
      </NewsCardsContainer>
    </InfiniteScroll>
  );
};

export default NewsInfiniteScrollController;
