import React from "react";
import SignUp_Form from "../../components/Signup/Signup_Form";
import styled, { createGlobalStyle } from "styled-components";


const GlobalStyle = createGlobalStyle`
  html, body {
    overflow: hidden;
  }
`;

const PageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 0px;
  box-sizing: border-box;
  background-color: #f4f4f4;
`;

const SignUP_Page = () => {
  return (
    <>
      <GlobalStyle />
      <PageWrapper>
        <SignUp_Form />
      </PageWrapper>
    </>
  );
};

export default SignUP_Page;
