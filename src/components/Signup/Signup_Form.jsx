import React, { useState } from "react";
import styled from "styled-components";
import SignUp_Submit from "./SignUp_Submit";
import GoToButton from "./GoToButton";

const FormWrapper = styled.div`
  width: 100%;
  max-width: 600px;
  margin: 50px auto;
  padding: 40px;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
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

const SignUp_Form = () => {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [errors, setErrors] = useState({
    id: "",
    password: "",
    nickname: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    // 에러 메시지 초기화
    setErrors({
      id: "",
      password: "",
      nickname: "",
    });

    // 입력값 검증
    let formIsValid = true;
    const newErrors = {};

    if (!id) {
      formIsValid = false;
      newErrors.id = "아이디 값이 필요합니다.";
    }
    if (!password) {
      formIsValid = false;
      newErrors.password = "비밀번호 값이 필요합니다.";
    }
    if (!nickname) {
      formIsValid = false;
      newErrors.nickname = "닉네임 값이 필요합니다.";
    }

    setErrors(newErrors);

    if (formIsValid) {
      alert(`아이디: ${id}, 비밀번호: ${password}, 닉네임: ${nickname}`);
    }
  };

  return (
    <FormWrapper>
      <GoToButton to="/login" />
      <FormTitle>회원 가입</FormTitle>

      <InputWrapper>
        <Input
          type="text"
          id="id"
          value={id}
          onChange={(e) => setId(e.target.value)}
          required
        />
        <Label htmlFor="id">아이디</Label>
        {errors.id && <ErrorMessage>{errors.id}</ErrorMessage>}
      </InputWrapper>

      <InputWrapper>
        <Input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Label htmlFor="password">비밀번호</Label>
        {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}
      </InputWrapper>

      <InputWrapper>
        <Input
          type="text"
          id="nickname"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          required
        />
        <Label htmlFor="nickname">닉네임</Label>
        {errors.nickname && <ErrorMessage>{errors.nickname}</ErrorMessage>}
      </InputWrapper>

      <SignUp_Submit onClick={handleSubmit} />
    </FormWrapper>
  );
};

export default SignUp_Form;
