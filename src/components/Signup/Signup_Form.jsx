// SignUp_Form.js
import React, { useState } from "react";
import styled from "styled-components";
import SignUp_Submit from "./SignUp_Submit";
import GoToButton from "./GoToButton";

const FormWrapper = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 50px auto;
  padding: 40px;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  position: relative;
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

const SignUp_Form = () => {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");

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
      </InputWrapper>

      <SignUp_Submit id={id} password={password} nickname={nickname} />
    </FormWrapper>
  );
};

export default SignUp_Form;
