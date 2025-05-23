import React, { useState } from "react";
import styled, { createGlobalStyle } from "styled-components";
import defaultImage from "../../assets/Goose.png";
import {
  faBookmark as faSolidBookmark,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons"; // 스크랩 아이콘
import { faBookmark as faRegularBookmark } from "@fortawesome/free-regular-svg-icons"; // 빈 스크랩
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from "../Modal/Modal";
import { postScrapNews } from "../../api/Scrap/ScrapNews";

const CardWrapper = styled.div`
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  width: 100%;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  margin-top: 20px;
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
  }

  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

// 뉴스 썸네일 이미지를 감싸는 컨테이너 (크기 지정)
const ThumbnailWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden; // 이미지가 래퍼를 벗어나지 않도록
  padding: 30px;
  width: 100%; // 모바일에서는 전체 너비
  height: 200px; // 모바일 이미지 높이

  @media (min-width: 768px) {
    width: 280px;
    min-width: 280px;
    height: 100%;
  }
`;

// 뉴스 썸네일 이미지
const Thumbnail = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

// 뉴스 내용 영역 (제목, 설명, 날짜, 버튼)
const ContentArea = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1; // 남은 공간을 모두 차지
  box-sizing: border-box;
  overflow: hidden;

  @media (min-width: 768px) {
    padding: 28px;
  }
`;

// 뉴스 제목
const Title = styled.h2`
  font-size: 1.4rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 12px 0;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;

  b {
    font-weight: inherit;
    color: #5a6fd8;
  }

  @media (min-width: 768px) {
    font-size: 1.6rem;
    margin: 0 0 16px 0;
  }
`;

// 뉴스 설명
const Description = styled.p`
  font-size: 0.95rem;
  color: #555555;
  line-height: 1.6;
  margin: 0 0 16px 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  flex-grow: 1;

  b {
    font-weight: inherit;
    color: #5a6fd8;
  }

  @media (min-width: 768px) {
    -webkit-line-clamp: 4;
    font-size: 1rem;
    margin: 0 0 20px 0;
  }
`;

// 카드 하단 영역 (날짜, 스크랩 버튼)
const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
`;

// 발행 날짜
const PublishDate = styled.span`
  font-size: 0.8rem;
  color: #888888;

  @media (min-width: 768px) {
    font-size: 0.85rem;
  }
`;

// 스크랩 버튼
const ScrapButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 20px;
  padding: 10px 20px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

  &:hover {
    background: linear-gradient(135deg, #5a6fd8 0%, #673f91 100%);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  @media (min-width: 768px) {
    padding: 12px 24px;
    font-size: 0.95rem;
  }
`;
const ModalMessage = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
`;

const ModalTitle = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  display: inline-block;
  width: 100%;
`;

const ErrorBanner = styled.div`
  background-color: #f8d7da;
  color: #721c24;
  padding: 15px;
  text-align: center;
  font-size: 1rem;
  border-radius: 5px;
  margin: 10px 0;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  display: ${({ visible }) => (visible ? "block" : "none")};
`;

const decodeHtmlEntities = (html) => {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
};

const getPlainText = (htmlString) => {
  const noTags = htmlString.replace(/<\/?[^>]+(>|$)/g, ""); // 모든 HTML 태그 제거
  return decodeHtmlEntities(noTags); // HTML 엔티티 디코딩
};

// 날짜 포맷팅 유틸리티 함수
const formatDate = (dateString) => {
  if (!dateString) return "날짜 정보 없음";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return "날짜 형식 오류";
  }
};

// 뉴스 카드 컴포넌트
const NewsCard = ({ newsItem }) => {
  const {
    title,
    description,
    pubDate,
    link,
    originallink,
    scraped,
    scrap,
    imageUrl,
  } = newsItem;
  const [isScrapped, setIsScrapped] = useState(scraped || scrap);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    onConfirm: null,
  });
  const [errorMessage, setErrorMessage] = useState(""); // 오류 메시지 상태

  // 스크랩 버튼 클릭 시 모달 열기
  const handleScrapButtonClick = (e) => {
    e.stopPropagation();
    const plainTitle = title.replace(/<\/?b>/g, "");
    if (isScrapped) {
      setModalContent({
        title: "스크랩 취소",
        message: (
          <div>
            <ModalTitle>{plainTitle}</ModalTitle>
            <br />
            <span>기사의 스크랩을 취소하시겠습니까?</span>
          </div>
        ),
        icon: faExclamationTriangle,
        iconColor: "#f0ad4e",
        onConfirm: () => confirmScrapAction(false, plainTitle),
        confirmText: "취소하기",
        cancelText: "유지하기",
      });
    } else {
      setModalContent({
        title: "기사 스크랩",
        message: (
          <div>
            <ModalTitle>{plainTitle}</ModalTitle>
            <br />
            <span>기사를 스크랩하시겠습니까?</span>
          </div>
        ),
        icon: faSolidBookmark,
        iconColor: "#5a6fd8",
        onConfirm: () => confirmScrapAction(true, plainTitle),
        confirmText: "스크랩",
        cancelText: "닫기",
      });
    }
    setIsModalOpen(true);
  };
  const confirmScrapAction = (scrapStatus, plainTitle) => {
    setIsScrapped(scrapStatus);
    setIsModalOpen(false);

    setErrorMessage("");
    const body = {
      title: getPlainText(title),
      originallink,
      link,
      description: getPlainText(title),
      pubDate,
      imageUrl,
    };
    postScrapNews(body)
      .then(() => {
        setErrorMessage("");
        console.log(
          `"${plainTitle}" 기사 스크랩 ${scrapStatus ? "완료" : "취소"}`
        );
      })
      .catch((error) => {
        // 오류 발생 시 버튼 상태를 원래대로 되돌리기
        setIsScrapped(!scrapStatus); // 상태 초기화
        setErrorMessage(
          "스크랩 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요."
        ); // 오류 메시지 설정
        console.error("스크랩 처리 중 오류 발생:", error);
      });
  };

  const handleCardClick = (e) => {
    if (e.target.tagName === "BUTTON" || e.target.closest("button")) {
      return;
    }
    window.open(link || originallink, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      <ErrorBanner visible={errorMessage !== ""}>{errorMessage}</ErrorBanner>

      <CardWrapper onClick={handleCardClick} style={{ cursor: "pointer" }}>
        <ThumbnailWrapper>
          <Thumbnail
            src={imageUrl ? imageUrl : defaultImage}
            alt={`${title.replace(/<\/?b>/g, "")} 썸네일`}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://placehold.co/280x280/e0e0e0/757575?text=No+Image";
            }}
          />
        </ThumbnailWrapper>
        <ContentArea>
          <div>
            <Title dangerouslySetInnerHTML={{ __html: title }} />
            <Description dangerouslySetInnerHTML={{ __html: description }} />
          </div>
          <Footer>
            <PublishDate>{formatDate(pubDate)}</PublishDate>
            <ScrapButton
              onClick={handleScrapButtonClick}
              isScrapped={isScrapped}
              aria-label={isScrapped ? "스크랩 취소" : "스크랩 하기"}
            >
              <FontAwesomeIcon
                icon={isScrapped ? faSolidBookmark : faRegularBookmark}
              />
            </ScrapButton>
          </Footer>
        </ContentArea>
      </CardWrapper>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={modalContent.onConfirm}
        title={modalContent.title}
        confirmText={modalContent.confirmText}
        cancelText={modalContent.cancelText}
        icon={modalContent.icon}
        iconColor={modalContent.iconColor}
      >
        <ModalMessage>{modalContent.message}</ModalMessage>
      </Modal>
    </>
  );
};

export { NewsCard };
