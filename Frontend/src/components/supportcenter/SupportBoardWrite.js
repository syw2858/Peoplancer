import { useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../css/SupportCenter.css";
const SupportBoardWrite = () => {
  const titleRef = useRef();
  const contentRef = useRef();
  const navigate = useNavigate();
  const user_id = window.sessionStorage.getItem("user_id");
  const handleInsert = () => {
    console.log("handleInsert =>", titleRef.current.value);
    if (!user_id) {
      alert("로그인후 작성하세요!!!");
    }
    if (titleRef.current.value === "" || titleRef.current.value === undefined) {
      alert("제목을 입력하세요!!!");
      titleRef.current.focus();
      return false;
    }
    if (
      contentRef.current.value === "" ||
      contentRef.current.value === undefined
    ) {
      alert("내용을 입력하세요!!!");
      contentRef.current.focus();
      return false;
    }

    axios
      .post("http://localhost:8080/support/board/insert", {
        sbqwriter: user_id,
        sbqsubject: titleRef.current.value,
        sbqcontent: contentRef.current.value,
      })
      .then((res) => {
        navigate("/support/board");
      })
      .catch((e) => {
        console.error(e);
      });
  };

  return (
    <div id="sc">
      <h1>고객센터</h1>
      <hr></hr>
      <div id="sc_tt">
        <Link to="/support">자주하는 질문</Link>
        <Link to="/support/board" className="sccolor">
          문의 내역
        </Link>
      </div>
      <div>
        <input type="hidden" name="writer" id="writer" />

        <div className="sc_bl_wr">
          <div className="one-box">
            <dl>
              <dt>
                <label htmlFor="title">제목</label>
              </dt>
              <dd>
                <input
                  type="text"
                  id="title"
                  name="title"
                  ref={titleRef}
                  placeholder="제목을 입력하세요."
                  className="w100"
                />
              </dd>
            </dl>
          </div>
          <input type="hidden" name="usernm" />
          <input type="hidden" name="insertuser" />
          <div className="one-box">
            <dl>
              <dt>
                <label htmlFor="content">내용</label>
              </dt>
              <dd>
                <div className="editer-wrapper">
                  <textarea
                    id="content"
                    ref={contentRef}
                    name="content"
                    cols="50"
                    rows="50"
                    placeholder="내용을 입력하세요."
                  ></textarea>
                </div>
              </dd>
            </dl>
          </div>
        </div>
        <div className="btns-area">
          <Link
            onClick={() => handleInsert()}
            className="btn-m02 btn-color01 depth2"
          >
            등록
          </Link>
          <Link
            onClick={() => navigate(-1)}
            className="btn-m02 btn-color06 depth2"
          >
            취소
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SupportBoardWrite;
