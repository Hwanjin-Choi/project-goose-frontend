import { useEffect, useState, useRef } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import styled from "styled-components";

import { NewsCard } from "../NewsCard/NewsCard";
import NewsCardSkeleton from "../NewsCardSkeleton/NewsCardSkeleton";
import { useSelector, useDispatch } from "react-redux";
import { getNewsByParam, resetNewsState } from "../../redux/news/newsSlice";

const NewsCardsContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  margin: 0 auto;
`;

const NEWS_START_INDEX = 1;
const NEWS_DISPLAY_INDEX = 10;

const InfiniteScrollController = () => {
  const currentKeywordFromStore = useSelector(
    (state) => state.keyword.searchText
  );
  const { newsList, status, hasMore } = useSelector((state) => state.news);

  const [start, setStart] = useState(NEWS_START_INDEX);

  const dispatch = useDispatch();
  const prevKeywordRef = useRef(null);

  const fetchNewsData = (isNewKeywordSearch = false) => {
    // Log when fetchNewsData is called

    if (!currentKeywordFromStore) {
      return;
    }

    const currentOffset = isNewKeywordSearch ? NEWS_START_INDEX : start;

    dispatch(
      getNewsByParam({
        keyword: currentKeywordFromStore,
        offset: currentOffset,
        limit: NEWS_DISPLAY_INDEX,
      })
    );

    if (isNewKeywordSearch) {
      setStart(NEWS_START_INDEX + NEWS_DISPLAY_INDEX);
    } else {
      setStart((prev) => {
        const newStart = prev + NEWS_DISPLAY_INDEX;
        return newStart;
      });
    }
  };

  useEffect(() => {
    if (
      currentKeywordFromStore &&
      currentKeywordFromStore !== prevKeywordRef.current
    ) {
      dispatch(resetNewsState()); // Reset news list when keyword changes
      setStart(NEWS_START_INDEX); // Reset start index
      fetchNewsData(true); // Pass true to indicate it's a new keyword search
      prevKeywordRef.current = currentKeywordFromStore;
    } else if (!currentKeywordFromStore && prevKeywordRef.current) {
      dispatch(resetNewsState()); // Reset news list if keyword is cleared
      prevKeywordRef.current = null;
      setStart(NEWS_START_INDEX); // Reset start index if keyword is cleared
    }
  }, [currentKeywordFromStore, dispatch]); // Removed fetchNewsData from dependencies as it causes re-renders. It's called conditionally inside.

  const loadMoreNews = () => {
    // Log when loadMoreNews is called (this is the 'next' function for InfiniteScroll)

    if (status !== "loading" && hasMore) {
      fetchNewsData(false);
    }
  };

  return (
    <>
      <InfiniteScroll
        dataLength={newsList.length}
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
          newsList.length > 0 && !hasMore ? ( // Show end message only if there are news items and no more to load
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
