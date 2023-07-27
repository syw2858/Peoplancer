import { useState, useRef, useEffect } from "react";
import "../../css/SupportCenter.css";
import axios from "axios";
import { Link } from "react-router-dom";
import SupportQuesion from "./SupportQuesion";
import Modal from "./modal";

const SupportCenter = () => {
  const [faqs, setFaqs] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const questionRef = useRef();
  const answerRef = useRef();
  const user_id = window.sessionStorage.getItem("user_id");
  useEffect(() => {
    getFaq();
  }, []);

  useEffect(() => {
    getFaq();
  }, [SupportQuesion]);
  const openModal = () => {
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
  };
  const getFaq = () => {
    axios
      .post("http://localhost:8080/support/faq/select", {})
      .then((res) => {
        setFaqs(res.data);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const insertFaq = () => {
    if (
      questionRef.current.value === "" ||
      questionRef.current.value === undefined
    ) {
      alert("질문을 입력하세요!!!");
      questionRef.current.focus();
      return false;
    }

    if (
      answerRef.current.value === "" ||
      answerRef.current.value === undefined
    ) {
      alert("답변을 입력하세요!!!");
      answerRef.current.focus();
      return false;
    }

    axios
      .post("http://localhost:8080/support/faq/insert", {
        scquestion: questionRef.current.value,
        scanswer: answerRef.current.value,
        scwriter: user_id,
      })
      .then((res) => {
        questionRef.current.value = "";
        answerRef.current.value = "";
        getFaq();
        closeModal();
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
        <Link to="/support" className="sccolor">
          자주하는 질문
        </Link>
        <Link to="/support/board">문의 내역</Link>
      </div>
      {faqs.map((question) => {
        return (
          <SupportQuesion key={question.scnum} {...question} getFaq={getFaq} />
        );
      })}
      <div className="btns-area sc_an_wr_btn">
        {user_id === "admin" ? (
          <Link className="btn-m02 btn-color01 depth2" onClick={openModal}>
            등록
          </Link>
        ) : (
          <></>
        )}
      </div>
      <Modal open={modalOpen} close={closeModal} header="질문등록">
        <form>
          <div className="sc_an sc_vi">
            <div className="sc_bl_wr sc_qu">
              <div className="sc_vi-contents">
                <div className="editer-wrapper">
                  <input
                    type="text"
                    id="quesion"
                    name="quesion"
                    placeholder="질문을 입력하세요."
                    className="w100"
                    ref={questionRef}
                  />
                </div>
                <div className="editer-wrapper">
                  <textarea
                    id="answer"
                    name="answer"
                    cols="50"
                    rows="50"
                    ref={answerRef}
                    placeholder="답변을 입력하세요."
                  ></textarea>
                </div>
                <div className="btns-area sc_qu_btn">
                  <Link
                    className="btn-m02 btn-color01"
                    onClick={() => insertFaq()}
                  >
                    등록
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};
export default SupportCenter;
