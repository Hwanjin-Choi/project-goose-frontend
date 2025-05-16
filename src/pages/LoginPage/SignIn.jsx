import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const navigate = useNavigate();

  const con = () => {
    console.log("아이디", email);
    console.log("비밀번호", pwd);
  };

  const navi = () => {
    navigate("/registration");
  };

  return (
    <>
      <h1>Goose</h1>
      <p>로그인 후 사용 가능합니다.</p>
      <div>
        <div>
          <span>아이디 : </span>
          <input
            type="text"
            name="email"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <span>비밀번호 : </span>
          <input
            type="password"
            name="pwd"
            placeholder="password"
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
          />
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
    </>
  );
};

export default Signin;
