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
    if (!currentKeywordFromStore) {
      return;
    }

    const currentOffset = isNewKeywordSearch ? NEWS_START_INDEX : start;

    console.log(
      `InfiniteScrollController: 뉴스 요청 - 키워드: ${currentKeywordFromStore}, offset: ${currentOffset}`
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
    } else {
      setStart((prev) => prev + NEWS_DISPLAY_INDEX);
    }
  };

  useEffect(() => {
    if (
      currentKeywordFromStore &&
      currentKeywordFromStore !== prevKeywordRef.current
    ) {
      console.log(
        "InfiniteScrollController: 새 키워드 감지 ->",
        currentKeywordFromStore
      );
      setStart(NEWS_START_INDEX);
      fetchNewsData(true);
      prevKeywordRef.current = currentKeywordFromStore;
    } else if (!currentKeywordFromStore && prevKeywordRef.current) {
      prevKeywordRef.current = null;
    }
  }, [currentKeywordFromStore, dispatch]);

  const loadMoreNews = () => {
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
              {[...Array(NEWS_DISPLAY_INDEX)].map((_, index) => (
                <NewsCardSkeleton key={`skeleton-${index}`} />
              ))}
            </>
          </NewsCardsContainer>
        }
        endMessage={
          newsList.length > 0 ? ( // 뉴스가 하나라도 로드된 후에만 "더 없습니다" 메시지 표시
            <p style={{ textAlign: "center" }}>
              <b>더 이상 뉴스가 없습니다.</b>
            </p>
          ) : null // 초기 로딩 중이거나, 검색 결과가 아예 없을 때는 endMessage를 숨김 (loader가 보이도록)
        }
        scrollThreshold={"70%"}
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
