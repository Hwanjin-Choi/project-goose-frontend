import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import styled from "styled-components";

import { NewsCard } from "../NewsCard/NewsCard";
import NewsCardSkeleton from "../../components/NewsCardSkeleton/NewsCardSkeleton";
import { useSelector, useDispatch } from "react-redux";
import { getNewsByParam, resetNewsState } from "../../redux/news/newsSlice";

const NewsCardsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  align-items: center;
  margin: 0 auto;
`;

const NEWS_START_INDEX = 1;
const NEWS_DISPLAY_INDEX = 10;

const InfiniteScrollController = () => {
  const currentKeyword = useSelector((state) => state.keyword.searchText);
  const newsList = useSelector((state) => state.news.newsList);
  const totalCount = useSelector((state) => state.news.totalCount);
  const status = useSelector((state) => state.news.status);
  const hasMore = useSelector((state) => state.news.hasMore);

  const [start, setStart] = useState(NEWS_START_INDEX);
  const [display, setDisplay] = useState(NEWS_DISPLAY_INDEX);

  const dispatch = useDispatch();

  const fetchNews = () => {
    const payload = {
      param: currentKeyword,
      start: start,
      display: display,
    };
    dispatch(getNewsByParam(payload));
    if (status.suscceeded) {
      setStart((prev) => prev + display);
    }
  };
  useEffect(() => {
    dispatch(resetNewsState());
    fetchNews();
  }, [currentKeyword]);

  return (
    <InfiniteScroll
      dataLength={newsList.length}
      next={fetchNews}
      hasMore={hasMore}
      loader={
        <NewsCardsContainer>
          <>
            {[...Array(1)].map((_, index) => (
              <NewsCardSkeleton key={`skeleton-${index}`} />
            ))}
          </>
        </NewsCardsContainer>
      }
      endMessage={
        <p style={{ textAlign: "center" }}>
          <b>뉴스가 더 없습니다.</b>
        </p>
      }
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
      scrollThreshold={"95%"}
    >
      <NewsCardsContainer>
        {newsList.map((item, index) => (
          <NewsCard key={index} newsItem={item} />
        ))}
      </NewsCardsContainer>
    </InfiniteScroll>
  );
};

export default InfiniteScrollController;
