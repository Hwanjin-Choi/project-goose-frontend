import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { login as setToken } from "../../redux/token/tokenSlice";
import { login as setAuth } from "../../redux/auth/authSlice";
import { login as loginApi } from "../../api/Login/loginApi";
import "./SignIn.css";

const Signin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
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

  const [modal, setModal] = useState({
    show: false,
    message: "",
    buttonText: "확인",
    onConfirm: () => {},
  });

  const con = async (e) => {
    e.preventDefault();

    setErrors({
      username: "",
      password: "",
    });

    let formIsValid = true;
    const newErrors = {};

    if (!userData.username) {
      formIsValid = false;
      newErrors.username = "아이디를 입력해야합니다.";
    }
    if (!userData.password) {
      formIsValid = false;
      newErrors.password = "비밀번호를 입력해야합니다.";
    }
    setErrors(newErrors);

    if (formIsValid) {
      try {
        const result = await loginApi(userData);
        console.log("서버 응답:", result);

        const { username, memberId, nickname } = result.data.data.userInfo;
        const { accessToken, refreshToken } = result.data.data.tokenInfo;

        dispatch(setToken({ accessToken, refreshToken }));
        dispatch(setAuth({ username, nickname }));

        console.log(username);
        console.log(memberId);
        console.log(nickname);

        navigate("/");
      } catch (error) {
        const errorMsg = error?.response?.data?.message || error.message;
        setModal({
          show: true,
          message: errorMsg,
          buttonText: "돌아가기",
          onConfirm: () => {
            setModal((prev) => ({ ...prev, show: false }));
          },
        });
      }
    }
  };

  const navi = () => {
    navigate("/registration");
  };

  const isAuthenticated = useSelector((state) => state.token.isAuthenticated);
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

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
      {modal.show && (
        <div className="modal-overlay">
          <div className="modal-content">
            <p>{modal.message}</p>
            <button className="modal-button" onClick={modal.onConfirm}>
              {modal.buttonText}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Signin;
