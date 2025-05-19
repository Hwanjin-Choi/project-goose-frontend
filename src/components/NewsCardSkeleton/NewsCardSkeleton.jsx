import React from "react";
import styled, { keyframes } from "styled-components";

// 로딩 애니메이션을 위한 keyframes 정의
const shimmer = keyframes`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
`;

// 스켈레톤 기본 스타일
const SkeletonElement = styled.div`
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 2000px 100%;
  animation: ${shimmer} 1.5s infinite linear;
  border-radius: 4px;
`;

// 기존 CardWrapper와 유사한 레이아웃을 위한 스켈레톤 래퍼
const SkeletonCardWrapper = styled.div`
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05); // 그림자는 조금 더 연하게
  display: flex;
  flex-direction: column;
  overflow: hidden;
  width: 100%;
  margin-top: 20px;

  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

// ThumbnailWrapper에 대응하는 스켈레톤
const SkeletonThumbnailWrapper = styled(SkeletonElement)`
  width: 100%; // 모바일에서는 전체 너비
  height: 200px; // 모바일 이미지 높이

  @media (min-width: 768px) {
    width: 280px;
    min-width: 280px;
    height: 100%; // 부모 높이에 맞춤
    border-radius: 16px 0 0 16px; // 왼쪽 모서리만 둥글게 (데스크탑 뷰)
  }
  border-radius: 16px 16px 0 0; // 모바일 뷰 상단 모서리
`;

// ContentArea에 대응하는 스켈레톤
const SkeletonContentArea = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
  box-sizing: border-box;
  overflow: hidden;

  @media (min-width: 768px) {
    padding: 28px;
  }
`;

// Title에 대응하는 스켈레톤
const SkeletonTitle = styled(SkeletonElement)`
  width: 80%;
  height: 1.4rem; // Title의 font-size와 유사하게
  margin-bottom: 12px;

  @media (min-width: 768px) {
    height: 1.6rem;
    margin-bottom: 16px;
  }
`;

// Description에 대응하는 스켈레톤 (여러 줄 표현)
const SkeletonDescriptionLine = styled(SkeletonElement)`
  height: 0.95rem; // Description의 font-size와 유사하게
  margin-bottom: 8px;

  @media (min-width: 768px) {
    height: 1rem;
  }
`;

const SkeletonDescription = () => (
  <div>
    <SkeletonDescriptionLine style={{ width: "100%" }} />
    <SkeletonDescriptionLine style={{ width: "90%" }} />
    <SkeletonDescriptionLine style={{ width: "70%" }} />
    {/* 데스크탑에서 한 줄 더 보이도록 조건부 렌더링 (선택 사항) */}
    {/* <MediaQuery minWidth={768}> (라이브러리 사용 시) */}
    {/* <SkeletonDescriptionLine style={{ width: "60%" }} /> */}
    {/* </MediaQuery> */}
    {/* 또는 CSS 미디어쿼리로 제어 */}
    <SkeletonDescriptionLine
      className="desktop-only"
      style={{ width: "60%" }}
    />
    <style jsx="true" global="true">{`
      .desktop-only {
        display: none;
      }
      @media (min-width: 768px) {
        .desktop-only {
          display: block;
        }
      }
    `}</style>
  </div>
);

// Footer에 대응하는 스켈레톤
const SkeletonFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px; // 실제 Footer의 margin-top: auto를 고려하여 적절한 값

  @media (min-width: 768px) {
    margin-top: 20px;
  }
`;

// PublishDate에 대응하는 스켈레톤
const SkeletonPublishDate = styled(SkeletonElement)`
  width: 30%;
  height: 0.8rem; // PublishDate의 font-size와 유사하게

  @media (min-width: 768px) {
    height: 0.85rem;
  }
`;

// ScrapButton에 대응하는 스켈레톤
const SkeletonScrapButton = styled(SkeletonElement)`
  width: 80px; // ScrapButton의 대략적인 너비
  height: 36px; // ScrapButton의 대략적인 높이 (padding 고려)
  border-radius: 20px; // ScrapButton의 border-radius

  @media (min-width: 768px) {
    width: 100px;
    height: 44px;
  }
`;

const NewsCardSkeleton = () => {
  return (
    <SkeletonCardWrapper>
      <SkeletonThumbnailWrapper />
      <SkeletonContentArea>
        <div>
          <SkeletonTitle />
          <SkeletonDescription />
        </div>
        <SkeletonFooter>
          <SkeletonPublishDate />
          <SkeletonScrapButton />
        </SkeletonFooter>
      </SkeletonContentArea>
    </SkeletonCardWrapper>
  );
};

export default NewsCardSkeleton;
