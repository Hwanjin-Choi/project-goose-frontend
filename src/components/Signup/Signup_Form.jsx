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
  const [userData, setUserData] = useState({
    id: "",
    password: "",
    nickname: "",
  });

  const [errors, setErrors] = useState({
    id: "",
    password: "",
    nickname: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setErrors({
      id: "",
      password: "",
      nickname: "",
    });

    let formIsValid = true;
    const newErrors = {};

    if (!userData.id) {
      formIsValid = false;
      newErrors.id = "아이디 값이 필요합니다.";
    }
    if (!userData.password) {
      formIsValid = false;
      newErrors.password = "비밀번호 값이 필요합니다.";
    }
    if (!userData.nickname) {
      formIsValid = false;
      newErrors.nickname = "닉네임 값이 필요합니다.";
    }

    setErrors(newErrors);

    if (formIsValid) {
      alert(
        `아이디: ${userData.id}, 비밀번호: ${userData.password}, 닉네임: ${userData.nickname}`
      );
      // 여기에 서버 요청 로직 추가 가능
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
          value={userData.id}
          onChange={handleChange}
          required
        />
        <Label htmlFor="id">ID</Label>
        {errors.id && <ErrorMessage>{errors.id}</ErrorMessage>}
      </InputWrapper>

      <InputWrapper>
        <Input
          type="password"
          id="password"
          value={userData.password}
          onChange={handleChange}
          required
        />
        <Label htmlFor="password">Password</Label>
        {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}
      </InputWrapper>

      <InputWrapper>
        <Input
          type="text"
          id="nickname"
          value={userData.nickname}
          onChange={handleChange}
          required
        />
        <Label htmlFor="nickname">Nickname</Label>
        {errors.nickname && <ErrorMessage>{errors.nickname}</ErrorMessage>}
      </InputWrapper>

      <SignUp_Submit onClick={handleSubmit} />
    </FormWrapper>
  );
};

export default SignUp_Form;
