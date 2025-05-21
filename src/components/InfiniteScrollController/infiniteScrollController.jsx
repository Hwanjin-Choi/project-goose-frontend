import { useEffect, useState, useRef } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import styled from "styled-components";

import { NewsCard } from "../NewsCard/NewsCard";
import NewsCardSkeleton from "../NewsCardSkeleton/NewsCardSkeleton";
import { useSelector, useDispatch } from "react-redux";
import { getNewsByParam, resetNewsState } from "../../redux/news/newsSlice";
import { useParams } from "react-router-dom";
import { setKeyword, clearKeyword } from "../../redux/keyword/keywordSlice";

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
  // Redux 스토어에서 현재 설정된 검색 키워드를 가져옵니다.
  // 이 키워드는 ViewNewsPage에 의해 URL 기준으로 설정됩니다.
  const currentKeywordFromStore = useSelector(
    (state) => state.keyword.searchText
  ); //
  const { newsList, status, hasMore } = useSelector((state) => state.news); // 구조 분해 할당 간소화

  const [start, setStart] = useState(NEWS_START_INDEX);
  const dispatch = useDispatch();

  // 이전 키워드를 저장하여, 실제 키워드 변경 시에만 초기화 로직을 수행하도록 합니다.
  const prevKeywordRef = useRef(null);

  // 뉴스 데이터 요청 함수
  const fetchNewsData = (isNewKeywordSearch = false) => {
    if (!currentKeywordFromStore) {
      // 키워드가 없으면 요청하지 않습니다. (ViewNewsPage에서 이미 처리 중일 수 있음)
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

    // 다음 요청을 위해 start 값을 업데이트합니다.
    // getNewsByParam.fulfilled에서 newsList 길이를 보고 hasMore가 false가 되면 더 이상 요청하지 않으므로,
    // 여기서는 무조건 다음 offset을 준비합니다.
    if (isNewKeywordSearch) {
      setStart(NEWS_START_INDEX + NEWS_DISPLAY_INDEX);
    } else {
      setStart((prev) => prev + NEWS_DISPLAY_INDEX);
    }
  };

  // Redux 스토어의 currentKeywordFromStore가 변경될 때 실행됩니다.
  useEffect(() => {
    // 현재 키워드가 존재하고, 이전 키워드와 다르다면 새로운 검색으로 간주합니다.
    if (
      currentKeywordFromStore &&
      currentKeywordFromStore !== prevKeywordRef.current
    ) {
      console.log(
        "InfiniteScrollController: 새 키워드 감지 ->",
        currentKeywordFromStore
      );
      // ViewNewsPage에서 이미 resetNewsState를 호출했을 것이므로, 여기서는 호출하지 않거나 중복 호출 방지 로직 필요.
      // 다만, 이 컴포넌트가 독립적으로 키워드 변경에 반응해야 한다면 여기서도 호출하는 것이 안전할 수 있습니다.
      // dispatch(resetNewsState()); // ViewNewsPage에서 처리하고 있으므로 주석 처리 또는 삭제 고려
      setStart(NEWS_START_INDEX); // start 인덱스를 초기값으로 리셋
      fetchNewsData(true); // 새 키워드로 데이터 요청 (isNewKeywordSearch = true)
      prevKeywordRef.current = currentKeywordFromStore; // 이전 키워드 업데이트
    } else if (!currentKeywordFromStore && prevKeywordRef.current) {
      // 키워드가 Redux 스토어에서 사라졌다면 (예: clearKeyword)
      // 여기서는 특별히 할 작업이 없을 수 있습니다. ViewNewsPage에서 resetNewsState를 이미 처리했을 것이기 때문입니다.
      // 필요하다면 여기서도 dispatch(resetNewsState());
      prevKeywordRef.current = null;
    }
    // newsSlice의 status가 'succeeded'일 때 start를 업데이트하는 로직은 fetchNewsData 내부 또는 next 함수에서 관리하는 것이 더 적절.
    // 기존 fetchNews 함수 내의 if (status === "succeeded") { setStart((prev) => prev + display); } 부분은
    // fetchNewsData로 로직이 통합되면서 offset 관리 방식으로 변경되었습니다.
  }, [currentKeywordFromStore, dispatch]); // currentKeywordFromStore 변경 시에만 반응

  const loadMoreNews = () => {
    if (status !== "loading" && hasMore) {
      // 로딩 중이 아닐 때만 추가 데이터 요청
      fetchNewsData(false); // 기존 키워드에 대한 추가 로드
    }
  };

  // 초기 마운트 시 또는 키워드가 있는데 뉴스가 없는 경우 첫 데이터 로드
  // (위의 useEffect에서 currentKeywordFromStore 변경 시 이미 처리하고 있으므로,
  // 이 부분은 중복될 수 있거나, 혹은 초기 렌더링 시점을 명확히 하기 위해 남겨둘 수 있습니다.
  // 하지만 currentKeywordFromStore 의존성 useEffect가 이미 이 역할을 하고 있습니다.)
  /*
  useEffect(() => {
    if (currentKeywordFromStore && newsList.length === 0 && status !== 'loading') {
      fetchNewsData(true); // 컴포넌트 마운트 후 첫 데이터 로드
    }
  }, [currentKeywordFromStore, newsList.length, status, dispatch]);
  */

  // 아래 useEffect는 이제 ViewNewsPage에서 URL 파라미터를 직접 처리하므로 제거합니다.
  /*
  useEffect(() => {
    if (params.keyword && params.keyword.length > 0) { //
      dispatch(setKeyword(params.keyword)); //
    }

    return () => {
      dispatch(clearKeyword()); //
      dispatch(resetNewsState()); //
    };
  }, []); //
  */

  if (!currentKeywordFromStore && newsList.length === 0) {
    // 키워드가 없고 뉴스 목록도 비어있다면, 렌더링하지 않거나 사용자에게 안내 메시지를 표시합니다.
    // ViewNewsPage에서 이미 {urlKeyword ? <InfiniteScrollController /> : ...} 처리를 했으므로,
    // 이 컴포넌트가 렌더링될 때는 항상 currentKeywordFromStore가 있을 것으로 예상할 수 있습니다.
    // 따라서 이 조건문은 필요 없을 수 있습니다.
  }
  return (
    <>
      <InfiniteScroll
        dataLength={newsList.length}
        next={fetchNewsData}
        hasMore={hasMore && status === "succeeded"}
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
