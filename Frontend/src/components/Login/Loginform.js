import { useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../css/loginform.css";

const Loginform = ({ onLogin }) => {
  const idRef = useRef();
  const pwRef = useRef();

  const navigate = useNavigate();

  const handleLogin = () => {
    if (idRef.current.value === "" || idRef.current.value === undefined) {
      alert("아이디를 입력하세요!");
      idRef.current.focus();
      return false;
    }
    if (pwRef.current.value === "" || pwRef.current.value === undefined) {
      alert("패스워드를 입력하세요!");
      pwRef.current.focus();
      return false;
    }

    axios
      .post("http://localhost:8080/user/Loginform", {
        user_id: idRef.current.value,
        user_pw: pwRef.current.value,
      })
      .then((res) => {
        console.log("Loginform =>", res);
        if (res.data === 1) {
          window.sessionStorage.setItem("user_id", idRef.current.value);
          onLogin();
          navigate("/");
        } else {
          navigate("/Loginform");
          alert("아이디나 비밀번호를 다시 확인해주세요.")
        }
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const Loginselect = () => {
    navigate("/Loginselect");
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h1>로그인</h1>
        <form>
          <hr />
          <div className="marginbottom">
            <label htmlFor="id" className="form-label">아이디</label>
            <input
              type="text"
              name="id"
              id="id"
              size="40"
              ref={idRef}
              placeholder="아이디를 입력하세요"
            />
          </div>
          <div className="marginbottom">
            <label htmlFor="password" className="form-label">패스워드</label>
            <input
              type="password"
              name="password"
              id="password"
              size="40"
              ref={pwRef}
              placeholder="비밀번호를 입력하세요"
            />
          </div>
          <div>
            <input
              type="button"
              value="로그인"
              onClick={handleLogin}
            />
            &nbsp;&nbsp;&nbsp;&nbsp;
            <input
              type="button"
              value="회원가입"
              onClick={Loginselect}
            />
          </div>
          <hr />
        </form>
      </div>
    </div>
  );
};


export default Loginform;