import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { setKeyword, clearKeyword } from "../../redux/keyword/keywordSlice";
import {
  faSearch,
  faUser,
  faBars,
  faFeatherAlt, // 사용되지 않으므로 주석 처리 또는 제거 가능
  faSignOutAlt,
  faUserCircle,
  faBookmark,
  faSignInAlt, // 로그인 아이콘 추가 (필요시 사용)
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useParams } from "react-router-dom";
import Goose from "../../assets/Goose_header.svg";
import { useSelector, useDispatch } from "react-redux";
import useMobileDetect from "../../hook/useMobileDetect";
const HEADER_HEIGHT = "68px";

// Styled Components 정의
const HeaderWrapper = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  height: ${HEADER_HEIGHT};
  padding: 0 1rem; /* 양 옆 패딩 */
`;

const Container = styled.div`
  max-width: 1280px; /* 최대 너비 */
  margin: 0 auto;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const LogoLink = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  gap: 0.5rem;
  color: #1f2937; // text-gray-800
  &:hover {
    color: #3b82f6; // hover:text-blue-600 (예시)
  }
`;

const LogoText = styled.span`
  font-size: 1.25rem; // text-xl
  font-weight: bold;
`;

const SearchWrapperDesktop = styled.div`
  flex-grow: 1;
  display: flex;
  justify-content: center;
  padding: 0 1rem;
  @media (max-width: 767px) {
    display: none;
  }
`;

const UserActionsWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  position: relative; /* 드롭다운 기준점 */
`;

const UserButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem; // text-sm
  font-weight: 500; // font-medium
  color: #374151; // text-gray-700
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.375rem; // rounded-md
  &:hover {
    color: #3b82f6; // hover:text-blue-600
    background-color: #f3f4f6; // hover:bg-gray-100
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  right: 0;
  top: calc(100% + 0.5rem); // 버튼 바로 아래
  width: 200px;
  background-color: white;
  border-radius: 0.375rem; // rounded-md
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05); // shadow-xl
  padding: 0.25rem 0; // py-1
  border: 1px solid #e5e7eb;
  z-index: 60;
`;

const DropdownItem = styled.button`
  display: block;
  width: 100%;
  text-align: left;
  padding: 0.5rem 1rem; // px-4 py-2
  font-size: 0.875rem; // text-sm
  color: #374151; // text-gray-700
  background: none;
  border: none;
  cursor: pointer;
  &:hover {
    background-color: #f3f4f6; // hover:bg-gray-100
  }
  svg {
    margin-right: 0.5rem;
  }
`;

const DropdownSearchWrapper = styled.div`
  padding: 0.5rem 1rem;
  border-top: 1px solid #e5e7eb; // border-t border-gray-100
`;

// ActionButton (Google 스타일 개선 적용)
const ActionButton = styled.button`
  padding: 0 16px;
  font-size: 0.875rem; /* 14px */
  font-weight: 600; /* 기존 500 (Medium) -> 600 (Semi-bold) 변경 */
  border-radius: 8px; /* 기존 4px -> 8px 변경으로 좀 더 부드러운 모서리 */
  cursor: pointer;
  transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out,
    border-color 0.2s ease-in-out, box-shadow 0.25s ease-in-out; /* box-shadow transition 추가 */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem; /* 기존 0.5rem -> 0.6rem 아이콘과 텍스트 간격 약간 증가 */
  line-height: 1.25;
  min-height: 38px; /* 기존 36px -> 38px 최소 높이 약간 증가 */
  text-align: center;
  vertical-align: middle;
  user-select: none;
  outline: none; /* 포커스 아웃라인은 focus-visible로 관리 */

  svg {
    font-size: 1.1em; /* 기존 1.125em, 약간의 크기 조정 여지 */
  }

  ${({ primary }) =>
    primary
      ? `
    background-color: #1A73E8; /* Google Blue */
    color: white;
    border: 1px solid transparent;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05); /* 기본 상태에 미세한 그림자 추가 */

    &:hover {
      background-color: #185ABC; /* 호버 시 약간 어둡게 */
      box-shadow: 0 2px 4px rgba(0,0,0,0.1), 0 4px 8px rgba(0,0,0,0.1); /* 호버 시 그림자 강화 */
    }
    &:active {
      background-color: #174EA6; /* 클릭 시 더 어둡게 */
      box-shadow: 0 1px 2px rgba(0,0,0,0.15); /* 활성 시 그림자 */
    }
    &:focus-visible { /* 키보드 포커스 시에만 아웃라인 표시 */
      outline: none;
      box-shadow: 0 0 0 3px rgba(26,115,232,0.4); /* Google 스타일 포커스 링 */
    }
  `
      : `
    background-color: white; /* 명시적인 흰색 배경 */
    color: #1A73E8; /* Google Blue 텍스트 */
    border: 1px solid #DADCE0; /* Google의 연회색 테두리 */
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03); /* 기본 상태에 매우 미세한 그림자 */

    &:hover {
      background-color: #f8f9fa; /* 호버 시 매우 연한 회색 배경 (Google 스타일) */
      border-color: #c6c9cc; /* 호버 시 테두리 색 약간 진하게 */
      box-shadow: 0 1px 3px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.07); /* 호버 시 그림자 추가 */
    }
    &:active {
      background-color: #f1f3f4; /* 클릭 시 배경색 */
      border-color: #b0b3b6;
      box-shadow: 0 1px 2px rgba(0,0,0,0.1);
    }
    &:focus-visible { /* 키보드 포커스 시에만 아웃라인 표시 */
      outline: none;
      border-color: #1A73E8; /* 포커스 시 테두리 색 강조 */
      box-shadow: 0 0 0 3px rgba(26,115,232,0.3); /* Google 스타일 포커스 링, 투명도 약간 조정 */
    }
  `}
`;

// MainSearchInput 컴포넌트 (Styled-Components)
const SearchContainerStyled = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  width: 100%;
  max-width: 584px;
  background-color: #f3f4f6;
  border: 1px solid transparent;
  border-radius: 9999px;
  height: 44px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  transition: box-shadow 0.2s ease-in-out;

  &:hover {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
      0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }

  &:focus-within {
    background-color: #ffffff;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px #3b82f6;
  }
`;

const StyledInput = styled.input`
  flex-grow: 1;
  height: 100%;
  padding: 0 20px 0 20px;
  font-size: 1rem;
  color: #1f2937;
  background-color: transparent;
  border: none;
  outline: none;
  border-radius: 9999px;
  padding-right: 48px;
`;

const SearchButtonStyled = styled.button`
  position: absolute;
  right: 0px;
  top: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  background-color: transparent;
  border: none;
  outline: none;
  cursor: pointer;
  padding: 0;
  border-radius: 0 9999px 9999px 0;
  color: #6b7280;
  &:hover {
    color: #3b82f6;
  }
`;

const MainSearchInput = ({
  value,
  onChange,
  onSearch,
  placeholder = "뉴스 검색",
}) => {
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(value);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearchSubmit(e);
    }
  };

  return (
    <SearchContainerStyled>
      <StyledInput
        type="text"
        value={value}
        onChange={onChange}
        onKeyPress={handleKeyPress}
        placeholder={placeholder}
        aria-label="검색"
      />
      <SearchButtonStyled onClick={handleSearchSubmit} aria-label="검색 실행">
        <FontAwesomeIcon icon={faSearch} />
      </SearchButtonStyled>
    </SearchContainerStyled>
  );
};

// Header 컴포넌트
const Header = () => {
  const params = useParams();
  const currentKeyword = useSelector((state) => state.keyword.searchText);
  const isAuthenticated = useSelector((state) => state.token.isAuthenticated);
  const [searchTerm, setSearchTerm] = useState(currentKeyword);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const isMobile = useMobileDetect();
  const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated); // 이 상태는 isAuthenticated로 대체 가능해 보입니다.

  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch(); // 현재 코드에서는 사용되지 않음

  const nickname = "문어체"; // 실제 닉네임은 Redux나 API로부터 받아와야 합니다.

  const onLogin = () => {
    // setIsLoggedIn(true); // Redux 상태 변경으로 처리되어야 함
    navigate("/login");
  };
  const onLogout = () => {
    // setIsLoggedIn(false); // 실제 로그아웃 로직 (Redux 상태 변경, API 호출 등) 필요
    // 예시: dispatch(logoutAction());
    console.log("Logout action dispatched (example)");
  };
  const onNavigate = (url) => {
    navigate(url);
  };

  const handleSearch = (term) => {
    if (term.trim() !== "") {
      onNavigate(`/view-news/${term}`);
    } else {
      console.log("Empty detected");
    }
  };

  const goToScrapAndResetKeyword = () => {
    dispatch(setKeyword("")); // 키워드 초기화
    onNavigate("/scrap"); // 스크랩 페이지 이동
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    setSearchTerm(currentKeyword);
  }, [currentKeyword]);

  useEffect(() => {
    // 로그인 상태 동기화
    setIsLoggedIn(isAuthenticated);
  }, [isAuthenticated]);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <HeaderWrapper>
      <Container>
        <LogoLink onClick={() => onNavigate("/")}>
          <img
            src={Goose}
            style={{ width: "30px", height: "30px" }}
            alt="logo"
          />
          <LogoText>구스</LogoText>
        </LogoLink>

        <SearchWrapperDesktop>
          <MainSearchInput
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onSearch={handleSearch}
          />
        </SearchWrapperDesktop>

        <UserActionsWrapper ref={dropdownRef}>
          {isLoggedIn ? ( // isAuthenticated를 직접 사용하는 것이 더 명확할 수 있습니다.
            <>
              <UserButton onClick={toggleDropdown}>
                {isMobile ? (
                  <FontAwesomeIcon icon={faBars} size="lg" />
                ) : (
                  <>
                    <FontAwesomeIcon icon={faUser} />
                    <span>{nickname}님 환영합니다</span>
                  </>
                )}
              </UserButton>
              {isDropdownOpen && (
                <DropdownMenu>
                  {isMobile && (
                    <>
                      <DropdownSearchWrapper>
                        <MainSearchInput
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          onSearch={(term) => {
                            handleSearch(term);
                            setIsDropdownOpen(false);
                          }}
                          placeholder="검색"
                        />
                      </DropdownSearchWrapper>
                      <DropdownItem
                        onClick={() => {
                          onNavigate("/scrap");
                          setIsDropdownOpen(false);
                        }}
                      >
                        <FontAwesomeIcon icon={faBookmark} />
                        저장된 기사
                      </DropdownItem>
                    </>
                  )}
                  <DropdownItem
                    onClick={() => {
                      onLogout(); // 실제 로그아웃 처리 필요
                      setIsDropdownOpen(false);
                    }}
                  >
                    <FontAwesomeIcon icon={faSignOutAlt} />
                    로그아웃
                  </DropdownItem>

                  <DropdownItem
                    onClick={() => {
                      onNavigate("/my-page");
                      setIsDropdownOpen(false);
                    }}
                  >
                    <FontAwesomeIcon icon={faUserCircle} />
                    마이 페이지
                  </DropdownItem>
                </DropdownMenu>
              )}
              {!isMobile && (
                <ActionButton
                  primary // primary="true"와 동일
                  onClick={() => onNavigate("/scrap")}
                >
                  <FontAwesomeIcon icon={faBookmark} /> 저장된 기사
                </ActionButton>
              )}
            </>
          ) : (
            <ActionButton onClick={onLogin}>
              {/* <FontAwesomeIcon icon={faSignInAlt} />  로그인 아이콘 추가 예시 */}
              로그인
            </ActionButton>
          )}
        </UserActionsWrapper>
      </Container>
    </HeaderWrapper>
  );
};

export { HEADER_HEIGHT };
export default Header;
