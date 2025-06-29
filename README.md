# 🦢 프로젝트 구스 (Project Goose) - 뉴스 검색 플랫폼

**프로젝트 구스**는 사용자가 원하는 뉴스를 쉽고 빠르게 검색하고, 인기 검색어를 시각적으로 탐색할 수 있는 모던 뉴스 검색 플랫폼입니다. React와 Redux를 기반으로 구축되어 반응성이 뛰어나고 사용자 친화적인 UI/UX를 제공합니다.

<br/>

## ✨ 주요 기능 (Key Features)

- **📰 뉴스 검색**: 키워드를 입력하여 관련 뉴스를 실시간으로 검색합니다.
- **☁️ 인기 검색어 워드 클라우드**: D3.js를 활용하여 인기 검색어를 시각적인 워드 클라우드(Packed Bubble Chart)로 제공합니다. 클릭 한 번으로 해당 키워드의 뉴스를 바로 탐색할 수 있습니다.
- **♾️ 무한 스크롤**: 사용자가 스크롤을 내리면 다음 뉴스 목록을 자동으로 불러와 끊김 없는 뉴스 탐색 경험을 제공합니다.
- **👤 사용자 인증 및 개인화**:
  - **로그인/로그아웃**: 사용자 계정을 통해 서비스를 이용할 수 있습니다.
  - **기사 스크랩**: 로그인한 사용자는 관심 있는 기사를 스크랩하여 '저장된 기사' 페이지에서 언제든지 다시 볼 수 있습니다.
  - **마이페이지**: 사용자 정보를 관리할 수 있는 페이지를 제공합니다.
- **📱 반응형 웹 디자인**: 데스크톱, 태블릿, 모바일 등 다양한 디바이스 환경에 최적화된 UI를 제공합니다.
- **💀 로딩 스켈레톤 UI**: 데이터 로딩 중에는 스켈레톤 UI를 표시하여 사용자가 콘텐츠가 로딩되고 있음을 직관적으로 인지할 수 있도록 하여 사용자 경험을 향상시킵니다.

<br/>

## 🛠️ 기술 스택 (Tech Stack)

### Frontend

| Category               | Technology                        | Description                 |
| :--------------------- | :-------------------------------- | :-------------------------- |
| **Core**               | `React`                           | 컴포넌트 기반 UI 라이브러리 |
| **State Management**   | `Redux`, `Redux Toolkit`          | 전역 상태 관리              |
| **Styling**            | `styled-components`               | CSS-in-JS 스타일링          |
| **Routing**            | `React Router`                    | 클라이언트 사이드 라우팅    |
| **Data Visualization** | `D3.js`                           | 워드 클라우드 시각화        |
| **Infinite Scroll**    | `react-infinite-scroll-component` | 무한 스크롤 구현            |
| **Icons**              | `Font Awesome`                    | 아이콘 라이브러리           |

### Backend (예상)

- `Node.js`, `Express` 또는 `NestJS`
- `Database` (e.g., `MySQL`, `PostgreSQL`, `MongoDB`)
- `RESTful API`

<br/>

## 🚀 시작하기 (Getting Started)

프로젝트를 로컬 환경에서 실행하는 방법입니다.

### Prerequisites

- Node.js (LTS 버전 권장)
- `npm` 또는 `yarn`

### Installation & Run

1.  **저장소 복제 (Clone the repository)**

    ```bash
    git clone https://github.com/your-username/project-goose-frontend.git
    cd project-goose-frontend
    ```

2.  **의존성 설치 (Install dependencies)**

    ```bash
    npm install
    # 또는
    # yarn install
    ```

3.  **환경 변수 설정 (Environment Variables)**

    프로젝트 루트 디렉토리에 `.env` 파일을 생성하고, 백엔드 API 서버의 주소를 설정합니다.

    ```
    REACT_APP_API_BASE_URL=http://your.backend.api.address
    ```

4.  **개발 서버 실행 (Run the development server)**

    ```bash
    npm start
    # 또는
    # yarn start
    ```

    서버가 실행되면 브라우저에서 `http://localhost:3000`으로 접속하여 확인할 수 있습니다.

<br/>

## 📁 프로젝트 구조 (Project Structure)

```
project-goose-frontend/
├── public/
└── src/
    ├── assets/         # 이미지, 폰트 등 정적 에셋
    ├── components/     # 재사용 가능한 UI 컴포넌트
    │   ├── Header/
    │   ├── InfiniteScrollController/
    │   ├── NewsCard/
    │   ├── NewsCardSkeleton/
    │   └── WordCloud/
    ├── hook/           # 커스텀 훅
    ├── pages/          # 라우팅되는 페이지 컴포넌트
    ├── redux/          # Redux 스토어 및 슬라이스
    │   ├── keyword/
    │   ├── news/
    │   ├── recommend/
    │   └── ...
    ├── App.js          # 메인 애플리케이션 컴포넌트
    └── index.js        # 애플리케이션 진입점
```

<br/>
