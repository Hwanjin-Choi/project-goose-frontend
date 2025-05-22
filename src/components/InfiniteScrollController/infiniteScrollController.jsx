import { useEffect, useState, useRef } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import styled from "styled-components";

import { NewsCard } from "../NewsCard/NewsCard";
import NewsCardSkeleton from "../NewsCardSkeleton/NewsCardSkeleton";

import { useSelector, useDispatch } from "react-redux";
import { getNewsByParam, resetNewsState } from "../../redux/news/newsSlice";
import {
  getScrapedNewsByParam,
  resetScrapedNewsState,
} from "../../redux/scrapedNews/scrapedNewsSlice";
import {
  getKeywordList,
  resetKeywordState,
} from "../../redux/recommend/recommendSlice";
  getKeywordList,
  resetKeywordState,
} from "../../redux/recommend/recommendSlice"; // resetKeywordState 임포트

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
const KEYWORD_FETCH_DELAY = 1750; // 1.75초 지연

/**
 * @param {Object} props
 * @param {"news" | "scraped"} props.mode
 */
const InfiniteScrollController = ({ mode = "news" }) => {
  const dispatch = useDispatch();
  const keywordFetchTimeoutRef = useRef(null);
  const prevKeywordRef = useRef(null);

  const currentKeyword = useSelector((state) => state.keyword.searchText);
  const isAuthenticated = useSelector((state) => state.token.isAuthenticated);

  const {
    list: displayList,
    status,
    hasMore,
  } = useSelector((state) =>
    mode === "news"
      ? {
          list: state.news.newsList,
          status: state.news.status,
          hasMore: state.news.hasMore,
        }
      : {
          list: state.scrapedNews.scrapedNewsList,
          status: state.scrapedNews.status,
          hasMore: state.scrapedNews.hasMore,
        }
  );

  const [start, setStart] = useState(NEWS_START_INDEX);

  const fetchNewsData = async (isNewKeywordSearch = false) => {
    if (!currentKeyword) return;

    const offset = isNewKeywordSearch ? NEWS_START_INDEX : start;

    try {
      const action = await dispatch(
        mode === "news"
          ? getNewsByParam({
              keyword: currentKeyword,
              offset,
              limit: NEWS_DISPLAY_INDEX,
            })
          : getScrapedNewsByParam({
              keyword: currentKeyword,
              offset,
              limit: NEWS_DISPLAY_INDEX,
            })
      );

      // 뉴스 + 인증 유저인 경우에만 추천 키워드 딜레이 호출
      if (
        mode === "news" &&
        getNewsByParam.fulfilled.match(action) &&
        isAuthenticated
      ) {
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
  // newsSlice의 status와 hasMore를 newsStatus, newsHasMore로 명확히 구분
  const {
    newsList,
    status: newsStatus,
    hasMore: newsHasMore,
  } = useSelector((state) => state.news);
  const isAuthenticated = useSelector((state) => state.token.isAuthenticated);

  const [start, setStart] = useState(NEWS_START_INDEX);
  const dispatch = useDispatch();
  const prevKeywordRef = useRef(null);
  const keywordFetchTimeoutRef = useRef(null);

  const fetchNewsData = async (isNewKeywordSearch = false) => {
    if (!currentKeywordFromStore) {
      return;
    }

    if (keywordFetchTimeoutRef.current) {
      clearTimeout(keywordFetchTimeoutRef.current);
    }

    const currentOffset = isNewKeywordSearch ? NEWS_START_INDEX : start;

    try {
      const newsAction = await dispatch(
        getNewsByParam({
          keyword: currentKeywordFromStore,
          offset: currentOffset,
          limit: NEWS_DISPLAY_INDEX,
        })
      );

      if (getNewsByParam.fulfilled.match(newsAction)) {
        if (isAuthenticated) {
          keywordFetchTimeoutRef.current = setTimeout(() => {
            dispatch(getKeywordList());
            keywordFetchTimeoutRef.current = null;
          }, KEYWORD_FETCH_DELAY);
        } else {
        }
      } else if (getNewsByParam.rejected.match(newsAction)) {
      }
    } catch (error) {}

    if (isNewKeywordSearch) {
      setStart(NEWS_START_INDEX + NEWS_DISPLAY_INDEX);
    } else {
      setStart((prev) => prev + NEWS_DISPLAY_INDEX);
    }
  };

  useEffect(() => {
    if (currentKeyword && currentKeyword !== prevKeywordRef.current) {
      // 키워드 변경 감지 시 상태 초기화
      if (mode === "news") {
        dispatch(resetNewsState());
        dispatch(resetKeywordState());
      } else {
        dispatch(resetScrapedNewsState());
      }

      setStart(NEWS_START_INDEX);
      fetchNewsData(true);
      prevKeywordRef.current = currentKeyword;
    } else if (!currentKeyword && prevKeywordRef.current) {
      // 키워드 제거 시 상태 초기화
      if (mode === "news") {
        dispatch(resetNewsState());
        dispatch(resetKeywordState());
      } else {
        dispatch(resetScrapedNewsState());
      }

      setStart(NEWS_START_INDEX);
      prevKeywordRef.current = null;
    if (
      currentKeywordFromStore &&
      currentKeywordFromStore !== prevKeywordRef.current
    ) {
      dispatch(resetNewsState());
      dispatch(resetKeywordState()); // 추천 키워드 상태 초기화
      setStart(NEWS_START_INDEX);
      fetchNewsData(true);
      prevKeywordRef.current = currentKeywordFromStore;
    } else if (!currentKeywordFromStore && prevKeywordRef.current) {
      dispatch(resetNewsState());
      dispatch(resetKeywordState()); // 추천 키워드 상태 초기화
      prevKeywordRef.current = null;
      setStart(NEWS_START_INDEX);
      if (keywordFetchTimeoutRef.current) {
        clearTimeout(keywordFetchTimeoutRef.current);
        keywordFetchTimeoutRef.current = null;
      }
    }

    return () => {
      if (keywordFetchTimeoutRef.current) {
        clearTimeout(keywordFetchTimeoutRef.current);
      }
    };
  }, [currentKeyword, dispatch, mode]);

  const loadMoreNews = () => {
    if (status !== "loading" && hasMore) {
  }, [currentKeywordFromStore, dispatch]);

  const loadMoreNews = () => {
    if (newsStatus !== "loading" && newsHasMore) {
      fetchNewsData(false);
    }
  };

  return (
    <InfiniteScroll
      dataLength={displayList.length}
      next={loadMoreNews}
      hasMore={hasMore && status !== "loading"}
      loader={
        status === "loading" ? (
          <NewsCardsContainer>
            {[...Array(3)].map((_, index) => (
              <NewsCardSkeleton key={`news-skeleton-${index}`} />
            ))}
          </NewsCardsContainer>
        ) : null
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
  // 이 컴포넌트의 로더는 뉴스 로딩에만 관여
  const showNewsLoader = newsStatus === "loading";

  return (
    <>
      <InfiniteScroll
        dataLength={newsList.length}
        next={loadMoreNews}
        hasMore={newsHasMore && newsStatus !== "loading"}
        loader={
          showNewsLoader ? (
            <NewsCardsContainer>
              <>
                {[...Array(3)].map((_, index) => (
                  <NewsCardSkeleton key={`news-skeleton-${index}`} />
                ))}
              </>
            </NewsCardsContainer>
          ) : null
        }
        endMessage={
          newsList.length > 0 && !newsHasMore && newsStatus !== "loading" ? (
            <p style={{ textAlign: "center" }}>
              <b>더 이상 뉴스가 없습니다.</b>
            </p>
          ) : null
        }
        scrollThreshold={"70%"}
      >
        <NewsCardsContainer>
          {newsList.map((item, index) => (
            <NewsCard key={index} newsItem={item} />
          ))}
        </NewsCardsContainer>
      </InfiniteScroll>
    </>
  );
};

export default InfiniteScrollController;
