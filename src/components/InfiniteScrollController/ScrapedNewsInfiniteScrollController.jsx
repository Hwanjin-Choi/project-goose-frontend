import { useEffect, useState, useRef } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import {
  getScrapedNewsByParam,
  resetScrapedNewsState,
} from "../../redux/scrapedNews/scrapedNewsSlice";
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

const ScrapedNewsInfiniteScrollController = () => {
  const dispatch = useDispatch();
  const isFetchingRef = useRef(false);
  const prevScrapKeywordRef = useRef(null);

  const currentScrapKeyword = useSelector(
    (state) => state.scrapKeyword.scrapSearchText
  );
  const displayList = useSelector((state) => state.scrapedNews.scrapedNewsList);
  const status = useSelector((state) => state.scrapedNews.status);
  const hasMore = useSelector((state) => state.scrapedNews.hasMore);

  const [start, setStart] = useState(NEWS_START_INDEX);

  const fetchScrapedNewsData = async (isNewKeywordSearch = false) => {
    if (isFetchingRef.current) return;

    isFetchingRef.current = true;

    const offset = isNewKeywordSearch ? NEWS_START_INDEX : start;

    try {
      await dispatch(
        getScrapedNewsByParam({
          keyword: currentScrapKeyword,
          offset,
          limit: NEWS_DISPLAY_INDEX,
        })
      );
      setStart(offset + NEWS_DISPLAY_INDEX);
    } catch (error) {
      console.error("스크랩 뉴스 로딩 실패:", error);
    } finally {
      isFetchingRef.current = false;
    }
  };

  useEffect(() => {
    dispatch(resetScrapedNewsState());
    setStart(NEWS_START_INDEX);
    prevScrapKeywordRef.current = currentScrapKeyword;
    fetchScrapedNewsData(true);

    return () => {};
  }, [currentScrapKeyword, dispatch]);

  const loadMoreScrapedNews = () => {
    if (status !== "loading" && hasMore) {
      fetchScrapedNewsData(false);
    }
  };

  return (
    <InfiniteScroll
      dataLength={displayList.length}
      next={loadMoreScrapedNews}
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
            <b>더 이상 스크랩된 뉴스가 없습니다.</b>
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

export default ScrapedNewsInfiniteScrollController;
