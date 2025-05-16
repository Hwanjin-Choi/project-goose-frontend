import React from "react";
import SignUp_Form from "../../components/Signup/Signup_Form";
import styled, { createGlobalStyle } from "styled-components";

const PageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 0px;
  box-sizing: border-box;
`;

const SignUP_Page = () => {
  return (
    <>
      <PageWrapper>
        <SignUp_Form />
      </PageWrapper>
    </>
  );
};

export default SignUP_Page;
