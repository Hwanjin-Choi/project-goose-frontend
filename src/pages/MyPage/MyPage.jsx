import React, { useState } from "react";
import styled from "styled-components";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // react-icons에서 아이콘을 임포트
import { modifyInfo } from "../../api/MyPage/modify";
import { dispatch } from "d3";
import { useDispatch } from "react-redux";
import { updateNickname } from "../../redux/token/tokenSlice";

const FormWrapper = styled.div`
  position: relative;
  width: 500px; /* 더 넓은 폼 영역 */
  margin: 50px auto;
  padding: 50px; /* 폼 내부 여백을 넓혀서 더 넓어 보이게 */
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 600px; /* 폼 영역의 최소 높이 설정 */
`;

const FormTitle = styled.h2`
  text-align: center;
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 30px;
  font-weight: bold;
  letter-spacing: 1px;
`;

const SectionTitle = styled.h3`
  text-align: left;
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 20px;
  font-weight: bold;
`;

const InputWrapper = styled.div`
  margin-bottom: 25px;
  position: relative;
  width: 100%;
`;

const Label = styled.label`
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 16px;
  color: #aaa;
  pointer-events: none;
  transition: 0.3s ease;
`;

const Input = styled.input`
  width: 100%;
  padding: 14px 10px;
  font-size: 16px;
  border: 2px solid #ddd;
  border-radius: 8px;
  transition: border-color 0.3s ease;
  box-sizing: border-box;
  background-color: transparent;
  color: #333;

  &:focus {
    outline: none;
    border-color: #4caf50;
  }

  &:focus + ${Label}, &:valid + ${Label} {
    top: -10px;
    font-size: 12px;
    color: #4caf50;
  }
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 12px;
  position: absolute;
  bottom: -30px;
  left: 50%;
  transform: translateX(-50%);
  margin-top: 5px;
`;

const TogglePasswordButton = styled.button`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #4caf50;
  cursor: pointer;
  font-size: 20px;
  padding: 0;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
  margin-bottom: 20px;
`;

const ToggleSectionButton = styled.button`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 12px 20px;
  background-color: #f0f0f0;
  color: #333;
  border: 1px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 20px;
  font-size: 16px;
  font-weight: bold;
  transition: background-color 0.3s;

  &:hover {
    background-color: #e0e0e0;
  }
`;

const ToggleIcon = styled.div`
  transition: transform 0.3s;
  ${(props) => props.isOpen && "transform: rotate(180deg);"}
`;

const MyPage = () => {
  const [formData, setFormData] = useState({
    currentPassword: null,
    newPassword: null,
    nickname: null,
  });

  const [errors, setErrors] = useState({
    currentPassword: "",
    newPassword: "",
    nickname: "",
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isPasswordSectionOpen, setIsPasswordSectionOpen] = useState(false);
  const [isNicknameSectionOpen, setIsNicknameSectionOpen] = useState(false);

  // 폼 값 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // 비밀번호 변경 핸들러
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setErrors({ currentPassword: "", newPassword: "" });

    let formIsValid = true;
    const newErrors = {};

    if (!formData.currentPassword) {
      formIsValid = false;
      newErrors.currentPassword = "비밀번호를 입력해주세요.";
    }
    if (!formData.newPassword) {
      formIsValid = false;
      newErrors.newPassword = "새 비밀번호를 입력해주세요.";
    }

    setErrors(newErrors);

    if (formIsValid) {
      try {
        const response = await modifyInfo({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
          nickname: null,
        });

        alert("비밀번호가 성공적으로 변경되었습니다.");
        setFormData({
          ...formData,
          currentPassword: "",
          newPassword: "",
        });
      } catch (error) {
        alert(error.message || "비밀번호 변경 중 오류가 발생했습니다.");
      }
    }
  };

  // 닉네임 변경 핸들러
  const dispatch = useDispatch();
  const handleNicknameSubmit = async (e) => {
    e.preventDefault();
    setErrors({ nickname: "" });

    let formIsValid = true;
    const newErrors = {};

    if (!formData.nickname) {
      formIsValid = false;
      newErrors.nickname = "닉네임을 입력해주세요.";
    }

    setErrors(newErrors);

    if (formIsValid) {
      try {
        const response = await modifyInfo({
          currentPassword: null,
          newPassword: null,
          nickname: formData.nickname,
        });

        alert("닉네임이 성공적으로 변경되었습니다.");
        dispatch(updateNickname(formData.nickname));
        setFormData({
          ...formData,
          nickname: "",
        });
      } catch (error) {
        alert(error || "닉네임 변경 중 오류가 발생했습니다.");
      }
    }
  };

  return (
    <FormWrapper>
      <FormTitle>회원 정보 변경</FormTitle>

      {/* 비밀번호 변경 토글 */}
      <ToggleSectionButton
        onClick={() => setIsPasswordSectionOpen(!isPasswordSectionOpen)}
      >
        <span>비밀번호 변경</span>
        <ToggleIcon isOpen={isPasswordSectionOpen}>▼</ToggleIcon>
      </ToggleSectionButton>

      {isPasswordSectionOpen && (
        <form>
          <InputWrapper>
            <Input
              type={showCurrentPassword ? "text" : "password"}
              id="currentPassword"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              required
            />
            <Label htmlFor="currentPassword">현재 비밀번호</Label>
            <TogglePasswordButton
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
            >
              {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
            </TogglePasswordButton>
            {errors.currentPassword && (
              <ErrorMessage>{errors.currentPassword}</ErrorMessage>
            )}
          </InputWrapper>

          <InputWrapper>
            <Input
              type={showNewPassword ? "text" : "password"}
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              required
            />
            <Label htmlFor="newPassword">새 비밀번호</Label>
            <TogglePasswordButton
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              {showNewPassword ? <FaEyeSlash /> : <FaEye />}
            </TogglePasswordButton>
            {errors.newPassword && (
              <ErrorMessage>{errors.newPassword}</ErrorMessage>
            )}
          </InputWrapper>

          <ButtonWrapper>
            <button
              type="submit"
              style={{
                padding: "10px 20px",
                backgroundColor: "#4caf50",
                color: "#fff",
                borderRadius: "8px",
                border: "none",
              }}
              onClick={handlePasswordSubmit}
            >
              비밀번호 변경
            </button>
          </ButtonWrapper>
        </form>
      )}

      {/* 닉네임 변경 토글 */}
      <ToggleSectionButton
        onClick={() => setIsNicknameSectionOpen(!isNicknameSectionOpen)}
      >
        <span>닉네임 변경</span>
        <ToggleIcon isOpen={isNicknameSectionOpen}>▼</ToggleIcon>
      </ToggleSectionButton>

      {isNicknameSectionOpen && (
        <form>
          <InputWrapper>
            <Input
              type="text"
              id="nickname"
              name="nickname"
              value={formData.nickname}
              onChange={handleChange}
              required
            />
            <Label htmlFor="nickname">새 닉네임</Label>
            {errors.nickname && <ErrorMessage>{errors.nickname}</ErrorMessage>}
          </InputWrapper>

          <ButtonWrapper>
            <button
              type="submit"
              style={{
                padding: "10px 20px",
                backgroundColor: "#4caf50",
                color: "#fff",
                borderRadius: "8px",
                border: "none",
              }}
              onClick={handleNicknameSubmit}
            >
              닉네임 변경
            </button>
          </ButtonWrapper>
        </form>
      )}
    </FormWrapper>
  );
};

export default MyPage;
