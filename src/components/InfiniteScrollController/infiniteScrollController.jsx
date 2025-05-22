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
    console.log(
      "[InfiniteScrollController] fetchNewsData called. isNewKeywordSearch:",
      isNewKeywordSearch,
      "currentKeyword:",
      currentKeywordFromStore
    );

    if (!currentKeywordFromStore) {
      console.log(
        "[InfiniteScrollController] No current keyword. Aborting fetch."
      );
      return;
    }

    const currentOffset = isNewKeywordSearch ? NEWS_START_INDEX : start;
    console.log(
      "[InfiniteScrollController] Fetching news with offset:",
      currentOffset,
      "and limit:",
      NEWS_DISPLAY_INDEX
    );

    dispatch(
      getNewsByParam({
        keyword: currentKeywordFromStore,
        offset: currentOffset,
        limit: NEWS_DISPLAY_INDEX,
      })
    );

    if (isNewKeywordSearch) {
      setStart(NEWS_START_INDEX + NEWS_DISPLAY_INDEX);
      console.log(
        "[InfiniteScrollController] New keyword search. Resetting start to:",
        NEWS_START_INDEX + NEWS_DISPLAY_INDEX
      );
    } else {
      setStart((prev) => {
        const newStart = prev + NEWS_DISPLAY_INDEX;
        console.log(
          "[InfiniteScrollController] Loading more. Updating start to:",
          newStart
        );
        return newStart;
      });
    }
  };

  useEffect(() => {
    console.log(
      "[InfiniteScrollController] useEffect triggered. currentKeywordFromStore:",
      currentKeywordFromStore,
      "prevKeywordRef.current:",
      prevKeywordRef.current
    );
    if (
      currentKeywordFromStore &&
      currentKeywordFromStore !== prevKeywordRef.current
    ) {
      console.log(
        "[InfiniteScrollController] Keyword changed or initial load with keyword. Resetting and fetching data."
      );
      dispatch(resetNewsState()); // Reset news list when keyword changes
      setStart(NEWS_START_INDEX); // Reset start index
      fetchNewsData(true); // Pass true to indicate it's a new keyword search
      prevKeywordRef.current = currentKeywordFromStore;
    } else if (!currentKeywordFromStore && prevKeywordRef.current) {
      console.log(
        "[InfiniteScrollController] Keyword cleared. Resetting prevKeywordRef and news state."
      );
      dispatch(resetNewsState()); // Reset news list if keyword is cleared
      prevKeywordRef.current = null;
      setStart(NEWS_START_INDEX); // Reset start index if keyword is cleared
    }
  }, [currentKeywordFromStore, dispatch]); // Removed fetchNewsData from dependencies as it causes re-renders. It's called conditionally inside.

  const loadMoreNews = () => {
    // Log when loadMoreNews is called (this is the 'next' function for InfiniteScroll)
    console.log(
      "[InfiniteScrollController] loadMoreNews called. Status:",
      status,
      "HasMore:",
      hasMore
    );
    console.log(
      "[InfiniteScrollController] Scroll threshold likely met (configured as 70%). Attempting to fetch more news."
    );

    if (status !== "loading" && hasMore) {
      fetchNewsData(false);
    } else {
      console.log(
        "[InfiniteScrollController] Not fetching more news. Status:",
        status,
        "HasMore:",
        hasMore
      );
    }
  };

  // Log current newsList length and hasMore status before rendering
  console.log(
    "[InfiniteScrollController] Rendering. NewsList length:",
    newsList.length,
    "HasMore:",
    hasMore,
    "Status:",
    status
  );

  return (
    <>
      <InfiniteScroll
        dataLength={newsList.length}
        next={loadMoreNews}
        hasMore={hasMore}
        loader={
          <NewsCardsContainer>
            <>
              {/* Log when loader is shown */}
              {console.log(
                "[InfiniteScrollController] Loader is being rendered."
              )}
              {[...Array(3)].map((_, index) => (
                <NewsCardSkeleton key={`skeleton-${index}`} />
              ))}
            </>
          </NewsCardsContainer>
        }
        endMessage={
          newsList.length > 0 && !hasMore ? ( // Show end message only if there are news items and no more to load
            <p style={{ textAlign: "center" }}>
              {/* Log when end message is shown */}
              {console.log(
                "[InfiniteScrollController] EndMessage is being rendered."
              )}
              <b>더 이상 뉴스가 없습니다.</b>
            </p>
          ) : null
        }
        scrollThreshold={"70%"} // This means loadMoreNews will be called when 70% of the scrollable content is visible
        // pullDownToRefresh 관련 기능은 주석 처리된 상태로 유지합니다.
        /* refreshFunction={() => {
        console.log("refreshing");
      }}
      pullDownToRefresh
      pullDownToRefreshThreshold={100}
      pullDownToRefreshContent={
        <h3 style={{ textAlign: "center" }}>&#8595; 아래로 당겨서 새로고침</h3>
      }
      releaseToRefreshContent={
        <h3 style={{ textAlign: "center" }}>&#8593; 놓으면 새로고침됩니다</h3>
      } */
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
