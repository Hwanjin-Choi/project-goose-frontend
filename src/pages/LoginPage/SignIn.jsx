import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SignIn.css";

const Signin = () => {
  const [userData, setUserData] = useState({
    id: "",
    pwd: "",
  });

  const ud = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // const con = () => {
  //   console.log("아이디", userData.id);
  //   console.log("비밀번호", userData.pwd);
  // };

  const [errors, setErrors] = useState({
    id: "",
    pwd: "",
  });

  const con = (e) => {
    e.preventDefault();

    setErrors({
      id: "",
      password: "",
    });

    let formIsValid = true;
    const newErrors = {};

    if (!userData.id) {
      formIsValid = false;
      newErrors.id = "아이디를 입력해야합니다.";
    }
    if (!userData.pwd) {
      formIsValid = false;
      newErrors.pwd = "비밀번호를 입력해야합니다.";
    }
    setErrors(newErrors);

    if (formIsValid) {
      console.log(`아이디: ${userData.id}, 비밀번호: ${userData.pwd}`);
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
              name="id"
              value={userData.id}
              onChange={ud}
              required
              placeholder=" "
            />
            <label htmlFor="email">ID</label>
            {errors.id && <div className="error-message">{errors.id}</div>}
          </div>
          <div className="floating-label">
            <input
              type="password"
              name="pwd"
              value={userData.pwd}
              onChange={ud}
              required
              placeholder=" "
            />
            <label htmlFor="pwd">Passwsord</label>
            {errors.pwd && <div className="error-message">{errors.pwd}</div>}
          </div>
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
