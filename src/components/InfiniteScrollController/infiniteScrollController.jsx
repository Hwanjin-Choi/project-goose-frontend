import { useEffect, useState } from "react";
import { getNewsApi, resetNewsFetchIndex } from "../../api/News/fetchNews";
import InfiniteScroll from "react-infinite-scroll-component";
import styled from "styled-components";

import { NewsCard } from "../NewsCard/NewsCard";

const NewsCardsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  max-width: 800px;
  align-items: center;
  margin: 0 auto;
`;

const InfiniteScrollController = () => {
  const [items, setItems] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    resetNewsFetchIndex();
    void fetchData(); // 비동기 호출 명시
  }, []);

  const fetchData = async () => {
    try {
      const result = await getNewsApi();
      setItems((prev) => [...prev, ...result.news]);
      setHasMore(!result.done);
    } catch (error) {
      console.error("뉴스 로딩 오류:", error);
      setHasMore(false);
    }
  };

  const refresh = async () => {
    resetNewsFetchIndex();
    const result = await getNewsApi();
    setItems(result.news);
    setHasMore(!result.done);
  };

  return (
    <InfiniteScroll
      dataLength={items.length}
      next={fetchData}
      hasMore={hasMore}
      loader={<h4 style={{ textAlign: "center" }}>Loading...</h4>}
      endMessage={
        <p style={{ textAlign: "center" }}>
          <b>뉴스가 더 없습니다.</b>
        </p>
      }
      refreshFunction={refresh}
      pullDownToRefresh
      pullDownToRefreshThreshold={100}
      pullDownToRefreshContent={
        <h3 style={{ textAlign: "center" }}>&#8595; 아래로 당겨서 새로고침</h3>
      }
      releaseToRefreshContent={
        <h3 style={{ textAlign: "center" }}>&#8593; 놓으면 새로고침됩니다</h3>
      }
      scrollThreshold={0.95} // 페이지 하단 5%에서 로딩 시작
    >
      <NewsCardsContainer>
        {items.map((item) => (
          <NewsCard key={item.id} newsItem={item} />
        ))}
      </NewsCardsContainer>
    </InfiniteScroll>
  );
};

export default InfiniteScrollController;
