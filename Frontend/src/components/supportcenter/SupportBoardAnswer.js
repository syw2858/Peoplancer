/* eslint-disable jsx-a11y/anchor-is-valid */
import axios from "axios";
import "../../css/SupportCenter.css";
import { Link, useNavigate } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
const SupportBoardAnswer = (props) => {
  const navigate = useNavigate();
  const sbqnum = props.sbqnum;
  const [answerlist, setAnswerlist] = useState([]);
  const [answermodify, setAnswermodify] = useState();
  const writerRef = useRef();
  const contentRef = useRef();
  const mocontentRef = useRef();
  const user_id = window.sessionStorage.getItem("user_id");
  useEffect(() => {
    getAnswer();
  }, []);

  const getAnswer = () => {
    axios
      .post("http://localhost:8080/support/board/comment", {
        sbqnum: sbqnum,
      })
      .then((res) => {
        setAnswerlist(res.data.answerList);
      })
      .catch((e) => {
        console.error(e);
      });
  };
  const deleteAnswer = (data) => {
    axios
      .post("http://localhost:8080/support/answer/delete", {
        sbanum: data,
      })
      .then((res) => {
        getAnswer();
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const updateAnswer = (data) => {
    axios
      .post("http://localhost:8080/support/answer/update", {
        sbanum: data,
        sbaanswer: mocontentRef.current.value,
      })
      .then((res) => {
        getAnswer();
        setAnswermodify("");
        mocontentRef.current.value = "";
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const insertAnswer = () => {
    if (
      contentRef.current.value === "" ||
      contentRef.current.value === undefined
    ) {
      alert("내용을 입력하세요!!!");
      contentRef.current.focus();
      return false;
    }

    axios
      .post("http://localhost:8080/support/answer/insert", {
        sbaanswer: contentRef.current.value,
        sbawriter: user_id,
        sbquestion_id: sbqnum,
      })
      .then((res) => {
        contentRef.current.value = "";
        getAnswer();
      })
      .catch((e) => {
        console.error(e);
      });
  };

  return (
    <div className="sc_an sc_vi">
      {answerlist === null ||
      answerlist === undefined ||
      answerlist.length === 0 ? (
        <></>
      ) : (
        <div className="title-area">
          <h4>답변</h4>
        </div>
      )}

      {answerlist === null ||
        answerlist === undefined ||
        answerlist.map((data) => (
          <>
            {answermodify === data.sbanum ? (
              <>
                <div className="sc_bl_wr sc_an_wr">
                  <div className="sc_vi-contents">
                    <input type="hidden" value={data.sbanum}></input>
                    <div className="editer-wrapper mo_an_ta">
                      <textarea
                        id="content"
                        ref={mocontentRef}
                        name="content"
                        cols="50"
                        rows="50"
                        className="modi_an"
                        placeholder="내용을 입력하세요."
                        defaultValue={data.sbaanswer}
                      ></textarea>
                    </div>
                  </div>
                  <div className="btns-area sc_an_wr_btn">
                    <Link
                      className="btn-m02 btn-color01 depth2"
                      onClick={() => updateAnswer(data.sbanum)}
                    >
                      수정
                    </Link>
                    <Link
                      className="btn-m02 btn-color01 depth2"
                      onClick={() => setAnswermodify("")}
                    >
                      취소
                    </Link>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="sc_vi-contentarea">
                  <div className="sc_vi-contents sc_vi_list">
                    <pre>{data.sbaanswer}</pre>
                  </div>
                  <div className="sc_vi-information">
                    <dl className="sc_right">
                      <dt>등록일</dt>
                      <dd>{data.sbacreateDate}</dd>
                    </dl>
                  </div>
                </div>
                <div className="btns-area sc_an_wr_btn">
                  {user_id === "admin" ? (
                    <>
                      <Link
                        className="btn-m02 btn-color01 depth2"
                        onClick={() => setAnswermodify(data.sbanum)}
                      >
                        수정
                      </Link>
                      <Link
                        className="btn-m02 btn-color01 depth2"
                        onClick={() => deleteAnswer(data.sbanum)}
                      >
                        삭제
                      </Link>
                    </>
                  ) : (
                    <></>
                  )}
                </div>
              </>
            )}
          </>
        ))}
      {user_id === "admin" ? (
        <>
          <div className="title-area">
            <h4>답변 등록</h4>
          </div>
          <input type="hidden" name="id" id="id" value={sbqnum} />
          <input
            type="hidden"
            name="writer"
            id="writer"
            ref={writerRef}
            value={user_id}
          />
          <div className="sc_bl_wr sc_an_wr">
            <div className="sc_vi-contents">
              <div className="editer-wrapper">
                <textarea
                  id="content"
                  ref={contentRef}
                  name="content"
                  className="sc_vi_textarea"
                  cols="50"
                  rows="50"
                  placeholder="내용을 입력하세요."
                ></textarea>
              </div>
            </div>
            <div className="btns-area sc_an_wr_btn">
              <Link
                className="btn-m02 btn-color01 depth2"
                onClick={() => insertAnswer()}
              >
                등록
              </Link>
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default SupportBoardAnswer;
