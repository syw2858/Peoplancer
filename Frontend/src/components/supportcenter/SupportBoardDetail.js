/* eslint-disable jsx-a11y/anchor-is-valid */
import axios from "axios";
import "../../css/SupportCenter.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import SupportBoardAnswer from "./SupportBoardAnswer";
const SupportBoardDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const sbqnum = parseInt(id);
  const [boarddetail, setBoarddetail] = useState([]);
  const user_id = window.sessionStorage.getItem("user_id");
  useEffect(() => {
    getDetail();
  }, []);

  const getDetail = () => {
    axios
      .post("http://localhost:8080/support/board/detail", {
        sbqnum: sbqnum,
      })
      .then((res) => {
        setBoarddetail(res.data);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const handleDelete = () => {
    axios
      .post("http://localhost:8080/support/board/delete", {
        sbqnum: sbqnum,
      })
      .then((res) => {
        navigate("/support/board/");
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
      <div className="sc_vi">
        <div className="title-area ">
          <h4>{boarddetail.sbqsubject}</h4>
        </div>
        <div className="sc_vi-information board_detail">
          <dl>
            <dt>작성자</dt>
            <dd>{boarddetail.sbqwriter}</dd>
          </dl>
          <dl>
            <dt>등록일</dt>
            <dd>{boarddetail.sbqcreateDate}</dd>
          </dl>
        </div>
        <div className="sc_vi-contents">
          <pre>{boarddetail.sbqcontent}</pre>
        </div>
      </div>
      <SupportBoardAnswer sbqnum={sbqnum} />
      <div className="btns-area mt60">
        {user_id === boarddetail.sbqwriter || user_id === "admin" ? (
          <>
            <Link
              to={`/support/board/modify`}
              state={boarddetail.sbqnum}
              className="btn-m02 btn-color02 depth3"
            >
              수정
            </Link>
            <Link
              onClick={handleDelete}
              className="btn-m02 btn-color02 depth3 open-password"
            >
              삭제
            </Link>
          </>
        ) : (
          <></>
        )}

        <Link to="/support/board" className="btn-m02 btn-color01 depth3">
          목록
        </Link>
      </div>
    </div>
  );
};

export default SupportBoardDetail;
