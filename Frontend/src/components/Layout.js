import "../css/Layout.css";
import { useNavigate } from "react-router-dom";
import { Link, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const Layout = ({ isLoggedIn, handleLogout, onLogin }) => {
  const [user_id, setUserId] = useState("");
  const navigate = useNavigate();
  const [user_code, setUserCode] = useState("");

  useEffect(() => {
    const loggedInUserId = window.sessionStorage.getItem("user_id");
    setUserId(loggedInUserId);
    console.log(user_id);
    if (user_id == null) {
      handleLogout();
    } else {
      onLogin();
    }

    fetchUserCode(loggedInUserId);
  }, [user_id, isLoggedIn]);

  const fetchUserCode = async (userId) => {
    try {
      const response = await axios.get("http://localhost:8080/auth/user_code", {
        params: {
          user_id: userId,
        },
      });
      const userCode = response.data;
      setUserCode(userCode);
      window.sessionStorage.setItem("user_code", userCode);
    } catch (error) {
      console.error(error);
    }
  };

  const Logout = () => {
    window.sessionStorage.clear();

    setUserId("");
    handleLogout();
    navigate("/");
  };

  const goDirect = () => {
    if (user_id == null || '') {
      navigate("/loginform");
    } else {
      navigate("/direct");
    }
  }

  const getMyPageLink = () => {
    const storedUserCode = window.sessionStorage.getItem("user_code");
    if (storedUserCode === "free") {
      return "/free/mypage";
    } else if (storedUserCode === "client") {
      return "/client/mypage";
    } else if (storedUserCode === "admin") {
      return "/admin";
    } else {
      return "/loginform";
    }
  };

  return (
    <div id="Layout">
      <div id="Layoutwrapper">
        <header id="LayoutHeader">
          <div id="LayoutLogo">
            <Link to="/">
              <img src="/images/logo.png" width="200" alt="메인" />
            </Link>
          </div>

          <div id="dm">
            <div onClick={goDirect}>

              <img src="/images/dm.png" width="55px" alt="알림"></img>
            </div>
          </div>
          <div>
            <ul className="memberbtn">
              {isLoggedIn ? (
                <>
                  <li className="member">
                    <Link
                      to={getMyPageLink()}
                      style={{ textDecoration: "none" }}
                    >
                      마이페이지
                    </Link>
                  </li>
                  <li className="member">
                    <button
                      onClick={Logout}
                      style={{
                        backgroundColor: "transparent",
                        border: "none",
                        fontSize: "16px",
                      }}
                    >
                      <a>&nbsp;&nbsp;로그아웃</a>
                    </button>
                  </li>
                  <li className="welcome-message" style={{ fontSize: "17px", fontWeight: 600 }}>
                    {user_id} 회원님, 환영합니다!
                  </li>
                </>
              ) : (
                <>
                  <li className="member">
                    <Link to="/loginform" style={{ textDecoration: "none" }}>
                      로그인
                    </Link>
                  </li>
                  <li className="member">
                    <Link to="/Loginselect" style={{ textDecoration: "none" }}>
                      회원가입
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
          <div className="menubar">
            <ul>
              <li className="menu">
                <Link to="/" style={{ textDecoration: "none" }}>
                  <span className="menu">홈</span>
                </Link>
              </li>
              <li className="menu">
                <Link to="/pjlist" style={{ textDecoration: "none" }}>
                  <span className="menu">프로젝트 찾기</span>
                </Link>
              </li>
              <li className="menu">
                <Link to="/freelist" style={{ textDecoration: "none" }}>
                  <span className="menu">프리랜서 찾기</span>
                </Link>
              </li>
              <li className="menu">
                <Link to="/support" style={{ textDecoration: "none" }}>
                  <span className="menu">FAQ</span>
                </Link>
              </li>
            </ul>
          </div>
        </header>
        <section className="posts" align="center">
          <Outlet />
        </section>
      </div>

      <footer id="LayoutFooter">
        <center id="LayoutFooterCenter">
          <table>
            <tr>
              <td rowSpan={4}>
                <div class="logo">
                  <Link to="/">
                    <img src="/images/logo3.png" width="200" alt="프리랜서" />
                  </Link>
                </div>
              </td>
              <td>대표: 김성만</td>
            </tr>
            <tr>
              <td>피플랜서 | 서울특별시 강남구 멀티로 111</td>
            </tr>
            <tr>
              <td>고객센터 02-2244-7272(평일 09:00~18:00, 주말·공휴일 휴무)</td>
            </tr>
            <tr>
              <td>Copyright © PEOPLANCER all right reserved.</td>
            </tr>
          </table>
        </center>
      </footer>
    </div>
  );
};

export default Layout;
