import React from "react";
import styled from "styled-components";

const SubmitButton = styled.button`
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 12px 20px;
  font-size: 16px;
  font-weight: bold;
  border-radius: 25px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;

  &:hover {
    background-color: #45a049;
    transform: scale(1.05);
  }

  &:active {
    background-color: #388e3c;
  }
`;

const SignUp_Submit = ({ id, password, nickname }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`아이디: ${id}, 비밀번호: ${password}, 닉네임: ${nickname}`);
  };

  return (
    <SubmitButton type="submit" onClick={handleSubmit}>
      제출
    </SubmitButton>
  );
};

export default SignUp_Submit;
