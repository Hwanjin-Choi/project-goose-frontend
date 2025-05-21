import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SignIn.css";

import { login as setToken, logout } from "../../redux/tokenSlice";
import { useSelector, useDispatch } from "react-redux";
import { login as loginApi } from "../../api/Login/loginApi";

const Signin = () => {
  const dispatch = useDispatch();
  const [userData, setUserData] = useState({
    username: "",
    password: "",
  });

  const ud = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const [errors, setErrors] = useState({
    username: "",
    password: "",
  });

  const con = async (e) => {
    e.preventDefault();

    setErrors({
      username: "",
      password: "",
    });

    let noinform = true;
    const newErrors = {};

    if (!userData.username) {
      noinform = false;
      newErrors.username = "아이디를 입력해야합니다.";
    }
    if (!userData.password) {
      noinform = false;
      newErrors.password = "비밀번호를 입력해야합니다.";
    }
    setErrors(newErrors);

    if (!noinform) return;

    try {
      const result = await loginApi(userData);
      console.log("서버 응답:", result);

      const { accessToken, refreshToken } = result.data.data;

      dispatch(setToken({ accessToken, refreshToken }));

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      navigate("/");
    } catch (error) {
      console.error("로그인 실패:", error);
      alert("아이디 또는 비밀번호가 틀렸습니다.");
    }
  };

  const navigate = useNavigate();
  const navi = () => {
    navigate("/registration");
  };

  return (
    <div className="signin-container">
      <div className="login-box">
        <h1>Goows</h1>
        <p>로그인 후 사용 가능합니다.</p>
        <div>
          <div className="floating-label">
            <input
              type="text"
              name="username"
              value={userData.username}
              onChange={ud}
              required
              placeholder=" "
            />
            <label htmlFor="email">Username</label>
          </div>
          {errors.username && (
            <div className="error-message">{errors.username}</div>
          )}
          <div className="floating-label">
            <input
              type="password"
              name="password"
              value={userData.password}
              onChange={ud}
              required
              placeholder=" "
            />
            <label htmlFor="password">Passwsord</label>
          </div>
          {errors.password && (
            <div className="error-message">{errors.password}</div>
          )}
          <div>
            <button id="signin" onClick={con}>
              로그인
            </button>
            <button id="signup" onClick={navi}>
              회원가입
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;
