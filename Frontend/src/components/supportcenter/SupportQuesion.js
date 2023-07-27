import React, { useRef, useState } from "react";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import "../../css/SupportCenter.css";
import Modal from "./modal";
import axios from "axios";
import { Link } from "react-router-dom";

const SupportQuesion = ({ scnum, scquestion, scanswer, getFaq }) => {
  const user_id = window.sessionStorage.getItem("user_id");
  const [modalOpen, setModalOpen] = useState(false);
  const questionRef = useRef();
  const answerRef = useRef();
  const openModal = () => {
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
  };
  const [showInfo, setShowInfo] = useState(false);

  const updateFaq = (scnum) => {
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
      .post("http://localhost:8080/support/faq/update", {
        scquestion: questionRef.current.value,
        scanswer: answerRef.current.value,
        scnum: scnum,
      })
      .then((res) => {
        console.log(getFaq);
        getFaq();
        closeModal();
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const deleteFaq = (scnum) => {
    axios
      .post("http://localhost:8080/support/faq/delete", {
        scnum: scnum,
      })
      .then((res) => {
        getFaq();
      })
      .catch((e) => {
        console.error(e);
      });
  };

  return (
    <div>
      <ul className="ul_list_style">
        <li className="sc_lis">
          <div className="sc_lis-0" onClick={() => setShowInfo(!showInfo)}>
            <span className="sc_lis-1">Q</span>
            <span className="sc_lis-2">{scquestion}</span>
            <span className="sc_lis-3">
              {showInfo ? <AiOutlineMinus /> : <AiOutlinePlus />}
            </span>
          </div>
          {showInfo && (
            <div className="sc_an-0">
              <table>
                <tbody>
                  <tr>
                    <td width="68px" valign="top">
                      <div className="sc_an-1">A</div>
                    </td>
                    <td>
                      <span className="sc_an-2">
                        <pre className="nows">{scanswer}</pre>
                      </span>
                      <span className="sc_an-3">
                        {user_id === "admin" ? (
                          <>
                            <Link
                              className="btn_an"
                              name={scnum}
                              onClick={openModal}
                            >
                              수정
                            </Link>
                            &nbsp;
                            <Link
                              className="btn_an"
                              name={scnum}
                              onClick={() => deleteFaq(scnum)}
                            >
                              삭제
                            </Link>
                          </>
                        ) : (
                          <></>
                        )}
                      </span>
                      <Modal
                        open={modalOpen}
                        close={closeModal}
                        header="질문수정"
                      >
                        <form>
                          <div className="sc_an sc_vi">
                            <div className="sc_bl_wr sc_qu">
                              <div className="sc_vi-contents">
                                <div className="editer-wrapper">
                                  <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    defaultValue={scquestion}
                                    placeholder="질문을 입력하세요."
                                    className="w100"
                                    ref={questionRef}
                                  />
                                </div>
                                <div className="editer-wrapper">
                                  <textarea
                                    id="content"
                                    name="content"
                                    cols="50"
                                    rows="50"
                                    defaultValue={scanswer}
                                    ref={answerRef}
                                    placeholder="답변을 입력하세요."
                                  ></textarea>
                                </div>
                                <div className="btns-area sc_qu_btn">
                                  <Link
                                    className="btn-m02 btn-color01"
                                    onClick={() => updateFaq(scnum)}
                                  >
                                    수정
                                  </Link>
                                  <Link
                                    className="btn-m02 btn-color01"
                                    onClick={closeModal}
                                  >
                                    취소
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        </form>
                      </Modal>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </li>
      </ul>
    </div>
  );
};

export default SupportQuesion;
