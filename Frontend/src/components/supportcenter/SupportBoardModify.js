/* eslint-disable jsx-a11y/anchor-is-valid */
import axios from "axios";
import "../../css/SupportCenter.css";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
const SupportBoardModify = () => {
  const location = useLocation();
  const sbqnum = location.state;
  const titleRef = useRef();
  const navigate = useNavigate();
  const contentRef = useRef();
  const [boarddetail, setBoarddetail] = useState([]);
  useEffect(() => {
    getDetail();
  }, []);

  const getDetail = () => {
    // console.log("handleUpdate =>", article);
    axios
      .post("http://localhost:8080/support/board/detail", {
        sbqnum: sbqnum,
      })
      .then((res) => {
        console.log("res", res);
        setBoarddetail(res.data);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const handleUpdate = () => {
    axios
      .post("http://localhost:8080/support/board/update", {
        sbqnum: sbqnum,
        sbqsubject: titleRef.current.value,
        sbqcontent: contentRef.current.value,
      })
      .then((res) => {
        navigate(`/support/board/detail/${sbqnum}`);
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
        <form>
          <input
            type="hidden"
            name="id"
            id="id"
            defaultValue={boarddetail.sbqnum}
          />
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
                    defaultValue={boarddetail.sbqsubject}
                  />
                </dd>
              </dl>
            </div>
            <input type="hidden" name="writer" value={boarddetail.sbqwriter} />

            <div className="one-box">
              <dl>
                <dt>
                  <label htmlFor="content">내용</label>
                </dt>
                <dd>
                  <div className="editer-wrapper">
                    <textarea
                      id="content"
                      defaultValue={boarddetail.sbqcontent}
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
              onClick={() => handleUpdate()}
              className="btn-m02 btn-color01 depth2"
            >
              수정
            </Link>
            <Link
              onClick={() => navigate(-1)}
              className="btn-m02 btn-color06 depth2"
            >
              취소
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SupportBoardModify;
