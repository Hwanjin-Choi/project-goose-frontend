import apiClient from "../index";

// apiClient.js

const sampleNewsDataArray = [
  {
    id: 1,
    title:
      "코카인 숨긴 마크롱?…엘리제궁 &quot;코 푼 <b>휴지</b>였다&quot; (뉴스 1)",
    originallink: "https://www.yna.co.kr/view/AKR20250513133500081?input=1195m",
    link: "https://n.news.naver.com/mnews/article/001/0015385869?sid=104",
    description:
      "뉴스 1 설명입니다. 엘리제궁은 &quot;이건 코 풀 때 쓰는 <b>휴지</b>&quot;라고 반박했다.",
    pubDate: "Tue, 13 May 2025 17:16:00 +0900",
  },
  {
    id: 2,
    title: "가짜 뉴스 제목 2 (<b>중요</b>)",
    originallink: "https://example.com/news/2",
    link: "https://news.naver.com/example/2",
    description:
      "이것은 두 번째 가짜 뉴스 항목의 설명입니다. <b>키워드</b>를 포함합니다.",
    pubDate: "Wed, 14 May 2025 10:00:00 +0900",
  },
  {
    id: 3,
    title: "세 번째 뉴스 아이템 (<b>속보</b>)",
    originallink: "https://example.com/news/3",
    link: "https://news.naver.com/example/3",
    description:
      "세 번째 가짜 뉴스의 상세 내용입니다. <b>정보</b>가 들어있습니다.",
    pubDate: "Wed, 14 May 2025 12:30:00 +0900",
  },
  {
    id: 4,
    title: "네 번째 소식: 기술 혁신 (<b>AI</b>)",
    originallink: "https://example.com/news/4",
    link: "https://news.naver.com/example/4",
    description: "네 번째 뉴스는 기술 발전에 대한 것입니다. <b>미래</b> 기술.",
    pubDate: "Thu, 15 May 2025 09:00:00 +0900",
  },
  {
    id: 5,
    title: "환경 보호 캠페인 시작 (<b>지구</b>)",
    originallink: "https://example.com/news/5",
    link: "https://news.naver.com/example/5",
    description:
      "다섯 번째 뉴스는 환경 보호의 중요성을 강조합니다. <b>실천</b>이 중요합니다.",
    pubDate: "Thu, 15 May 2025 11:00:00 +0900",
  },
  {
    id: 6,
    title: "새로운 경제 정책 발표 (<b>성장</b>)",
    originallink: "https://example.com/news/6",
    link: "https://news.naver.com/example/6",
    description:
      "여섯 번째 뉴스는 경제 성장을 위한 새로운 정책에 관한 것입니다. <b>투자</b> 유치.",
    pubDate: "Fri, 16 May 2025 14:00:00 +0900",
  },
  {
    id: 7,
    title: "문화 행사 개최 안내 (<b>축제</b>)",
    originallink: "https://example.com/news/7",
    link: "https://news.naver.com/example/7",
    description:
      "일곱 번째 뉴스는 다가오는 문화 축제에 대한 정보입니다. <b>참여</b>하세요.",
    pubDate: "Fri, 16 May 2025 16:30:00 +0900",
  },
];

let currentIndex = 0; // 모듈 레벨에서 currentIndex를 유지합니다.

// currentIndex를 리셋하는 함수
export const resetNewsFetchIndex = () => {
  currentIndex = 0;
};

export const getNewsApi = async () => {
  try {
    const result = await new Promise((resolve) => {
      setTimeout(() => {
        if (currentIndex >= sampleNewsDataArray.length) {
          resolve({ news: [], done: true }); // 모든 뉴스를 다 가져왔음을 알림
          return;
        }
        const endIndex = Math.min(currentIndex + 3, sampleNewsDataArray.length);
        const batch = sampleNewsDataArray.slice(currentIndex, endIndex);
        currentIndex = endIndex;

        const done = currentIndex >= sampleNewsDataArray.length;
        resolve({ news: batch, done: done });
      }, 1500); // 1.5초 지연
    });
    return result; // { news: batch, done: boolean } 객체 반환
  } catch (error) {
    console.error("뉴스 가져오기 오류:", error);
    throw new Error("뉴스를 가져오는데 실패했습니다.");
  }
};

// 만약 apiClient 객체로 묶어서 export 하려면 아래와 같이 할 수 있습니다.
// const apiClient = {
//   getNewsApi,
//   resetNewsFetchIndex,
// };
// export default apiClient;
