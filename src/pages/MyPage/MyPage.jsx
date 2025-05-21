import React, { useState } from "react";
import styled from "styled-components";

const FormWrapper = styled.div`
  position: relative;
  width: 400px;
  margin: 50px auto;
  padding: 40px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const FormTitle = styled.h2`
  text-align: center;
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 30px;
  font-weight: bold;
  letter-spacing: 1px;
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

const MyPage = () => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    nickname: "",
  });

  const [errors, setErrors] = useState({
    currentPassword: "",
    newPassword: "",
    nickname: "",
  });

  // 폼 값 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({ currentPassword: "", newPassword: "", nickname: "" });

    let formIsValid = true;
    const newErrors = {};

    if (!formData.currentPassword) {
      formIsValid = false;
      newErrors.currentPassword = "현재 비밀번호를 입력해주세요.";
    }
    if (!formData.newPassword) {
      formIsValid = false;
      newErrors.newPassword = "새 비밀번호를 입력해주세요.";
    }
    if (!formData.nickname) {
      formIsValid = false;
      newErrors.nickname = "닉네임을 입력해주세요.";
    }

    setErrors(newErrors);

    if (formIsValid) {
      // 서버로 데이터를 전송하는 로직을 여기에 추가하세요.
      console.log("폼이 제출되었습니다.", formData);
    }
  };

  return (
    <FormWrapper>
      <FormTitle>회원 정보 변경</FormTitle>

      <form onSubmit={handleSubmit}>
        <InputWrapper>
          <Input
            type="password"
            id="currentPassword"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
            required
          />
          <Label htmlFor="currentPassword">현재 비밀번호</Label>
          {errors.currentPassword && (
            <ErrorMessage>{errors.currentPassword}</ErrorMessage>
          )}
        </InputWrapper>

        <InputWrapper>
          <Input
            type="password"
            id="newPassword"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            required
          />
          <Label htmlFor="newPassword">새 비밀번호</Label>
          {errors.newPassword && (
            <ErrorMessage>{errors.newPassword}</ErrorMessage>
          )}
        </InputWrapper>

        <InputWrapper>
          <Input
            type="text"
            id="nickname"
            name="nickname"
            value={formData.nickname}
            onChange={handleChange}
            required
          />
          <Label htmlFor="nickname">닉네임</Label>
          {errors.nickname && <ErrorMessage>{errors.nickname}</ErrorMessage>}
        </InputWrapper>

        <button
          type="submit"
          style={{
            padding: "10px 20px",
            backgroundColor: "#4caf50",
            color: "#fff",
            borderRadius: "8px",
            border: "none",
          }}
        >
          정보 변경
        </button>
      </form>
    </FormWrapper>
  );
};

export default MyPage;
