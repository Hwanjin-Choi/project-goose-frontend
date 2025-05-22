import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  registerUser,
  resetRegistrationState,
} from "../../redux/registration/registrationSlice";
import styled from "styled-components";
import SignUp_Submit_Btn from "./SignUp_Submit_Btn";
import GoToButton from "./GoToLoginButton";
import ReusableModal from "./ReusableModal";
import { useNavigate } from "react-router-dom";

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

const CheckboxWrapper = styled.div`
  width: 100%;
  margin-bottom: 25px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  color: #333;
`;

const SignUp_Form = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.registration);

  const [modal, setModal] = useState({
    show: false,
    message: "",
    buttonText: "확인",
    onConfirm: () => {},
  });

  const [userData, setUserData] = useState({
    username: "",
    password: "",
    nickname: "",
    admin: false,
  });

  const [errors, setErrors] = useState({
    username: "",
    password: "",
    nickname: "",
  });

  useEffect(() => {
    if (status === "failed" && error) {
      setModal({
        show: true,
        message: error, // 실패 메시지 설정
        buttonText: "닫기",
        onConfirm: () => {
          setModal((prev) => ({ ...prev, show: false }));
          dispatch(resetRegistrationState()); // 상태 초기화
        },
      });
    } else if (status === "succeeded") {
      setModal({
        show: true,
        message: "회원가입이 완료되었습니다.",
        buttonText: "로그인하러 가기",
        onConfirm: () => {
          setModal({ ...modal, show: false });
          dispatch(resetRegistrationState()); // 상태 초기화
          navigate("/login");
        },
      });
    }
  }, [status, error, navigate]);

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setUserData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    setErrors({ username: "", password: "", nickname: "" });

    let formIsValid = true;
    const newErrors = {};

    if (!userData.username) {
      formIsValid = false;
      newErrors.username = "아이디 값이 필요합니다.";
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
      await dispatch(registerUser(userData));
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    handleSubmit();
  };

  return (
    <>
      <FormWrapper>
        <GoToButton to="/login" />
        <FormTitle>회원 가입</FormTitle>

        {/* 입력 필드들 */}
        <InputWrapper>
          <Input
            type="text"
            id="username"
            value={userData.username}
            onChange={handleChange}
            required
          />
          <Label htmlFor="username">ID</Label>
          {errors.username && <ErrorMessage>{errors.username}</ErrorMessage>}
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

        <CheckboxWrapper>
          <input
            type="checkbox"
            id="admin"
            checked={userData.admin}
            onChange={handleChange}
          />
          <label htmlFor="admin">관리자 권한</label>
        </CheckboxWrapper>

        <SignUp_Submit_Btn onClick={onSubmit} disabled={status === "loading"} />
      </FormWrapper>

      {/* 모달 렌더 */}
      {modal.show && (
        <ReusableModal
          message={modal.message}
          buttonText={modal.buttonText}
          onConfirm={modal.onConfirm}
        />
      )}
    </>
  );
};

export default SignUp_Form;
