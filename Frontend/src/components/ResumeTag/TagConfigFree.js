import "../../css/Resume.css";
import Select from "react-select";
import React, { useState, useRef, useEffect } from "react";
import { occupation, occupations } from "./OccupationData";
import axios from "axios";
import Modal from "../supportcenter/modal";
import InputWon from "./InputWon";
import InputMonth from "./InputMonth";
import { Link } from "react-router-dom";

const TagConfigFree = ({ onRendering }) => {
  const [selectedoccupation, setSelectedOccupation] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedJobs, setSelectedJobs] = useState([]);
  const [redata, setRedata] = useState();
  const user_id = window.sessionStorage.getItem("user_id");
  const user_code = window.sessionStorage.getItem("user_code");
  const jgRef = useRef();
  const jobRef = useRef();
  const wsRef = useRef();
  const [ws, setWs] = useState("allok");
  const wtRef = useRef();
  const [wt, setWt] = useState("");
  const [pays, setPays] = useState(0);
  const pay = (data) => {
    setPays(data);
  };
  const startRef = useRef();
  const [start, setStart] = useState(null);
  const [months, setMonths] = useState(0);
  const month = (data) => {
    setMonths(data);
  };

  const openModal = () => {
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
  };
  const onClearSelect = () => {
    if (jobRef.current) {
      jobRef.current.clearValue();
    }
  };

  useEffect(() => {
    getTag();
    if (user_code === "free") {
      startstep();
    }
  }, []);

  useEffect(() => {
    if (redata) {
      setWs(redata.pj_work_form);
      setSelectedOccupation(redata.pj_job);
      /*setSelectedJobs(
        occupation[redata.fre_jg].filter((option) =>
          redata.fre_job.includes(option.value)
        )
      );*/
      setWt(redata.pj_place);
      setPays(redata.pj_pay);
      setStart(redata.pj_start);
      setMonths(redata.pj_day);
    }
  }, [redata]);

  const getTag = () => {
    axios
      .post("http://localhost:8080/fretag/select", {
        user_id: user_id,
      })
      .then((res) => {
        console.log(res.data);
        setRedata(res.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const startstep = () => {
    axios
      .post("http://localhost:8080/user/checkstart", {
        user_id: user_id,
        user_code: user_code,
      })
      .then((res) => {
        console.log("tag", res.data);
        const data = res.data;
        if (data === 1) {
          if (modalOpen === false) {
            setModalOpen(true);
          }
        }
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const insertTag = () => {
    axios
      .post("http://localhost:8080/fretag/select", {
        user_id: user_id,
      })
      .then((res) => {
        const count = res.data;
        if (count === "" || count === null) {
          axios
            .post("http://localhost:8080/fretag/insert", {
              user_id: user_id,
              pj_job: jgRef.current.props.value
                ? jgRef.current.props.value.value
                : null,
              /*fre_job: jobRef.current.props.value
                ? JSON.stringify(
                    jobRef.current.props.value.map((option) => option.value)
                  )
                : null,*/
              pj_work_form: wsRef.current.value || null,
              pj_place: wtRef.current.value || null,
              pj_pay: pays || null,
              pj_start: startRef.current.value || null,
              pj_day: months || null,
            })
            .then((res) => {
              axios
                .post("http://localhost:8080/user/updatet", {
                  user_id: user_id,
                  user_tag: 1,
                })
                .then((res) => {})
                .catch((e) => {
                  console.error(e);
                });
              onRendering();
              getTag();
              closeModal();
            })
            .catch((error) => {
              console.error(error);
            });
        } else {
          axios
            .post("http://localhost:8080/fretag/update", {
              user_id: user_id,
              pj_job: jgRef.current.props.value
                ? jgRef.current.props.value.value
                : null,
              /*fre_job: jobRef.current.props.value
                ? JSON.stringify(
                    jobRef.current.props.value.map((option) => option.value)
                  )
                : null,*/
              pj_work_form: wsRef.current.value || null,
              pj_place: wtRef.current.value || null,
              pj_pay: pays || null,
              pj_start: startRef.current.value || null,
              pj_day: months || null,
            })
            .then((res) => {
              axios
                .post("http://localhost:8080/user/updatet", {
                  user_id: user_id,
                  user_tag: 1,
                })
                .then((res) => {
                  getTag();
                  closeModal();
                  onRendering();
                })
                .catch((e) => {
                  console.error(e);
                });
              closeModal();
            })
            .catch((error) => {
              console.error(error);
            });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };
  return (
    <div className="in-bl ig_size">
      <img src="/images/tag-icon.png" onClick={openModal} />
      <Modal
        open={modalOpen}
        close={closeModal}
        header="추천 프로젝트 태그설정"
      >
        <div id="basic" className="resume_section">
          <div className="resume_write">
            <div className="resume_row">
              <span className="input_title">직군</span>
              <span className="resume_input">
                <Select
                  className="basic-single"
                  classNamePrefix="select"
                  placeholder="직군을 선택하세요"
                  name="job"
                  ref={jgRef}
                  options={occupations}
                  value={occupations.find(
                    (option) => option.value === selectedoccupation
                  )}
                  onChange={(e) => {
                    if (e) {
                      setSelectedOccupation(e.value);
                    } else {
                      setSelectedOccupation("");
                    }
                    onClearSelect();
                  }}
                />
              </span>
              <div className="input_title"></div>
              {/*<div className="resume_input">
                <Select
                  ref={jobRef}
                  isMulti
                  name="jobs"
                  placeholder="직무를 선택하세요"
                  options={occupation[selectedoccupation]}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  value={selectedJobs}
                  onChange={(e) => setSelectedJobs(e)}
                />
              </div>*/}
            </div>

            <div className="resume_row">
              <div className="input_title">근무방식</div>
              <div className="resume_input">
                <select className="box_input" defaultValue={ws} ref={wsRef}>
                  <option value="상관없음">상관없음</option>
                  <option value="상주">상주근무</option>
                  <option value="원격">원격근무</option>
                </select>
              </div>
            </div>
            <div className="resume_row">
              <div className="input_title">근무지역</div>
              <div className="resume_input">
                <select className="box_input" defaultValue={wt} ref={wtRef}>
                  <option value="">지역선택</option>
                  <option value="서울">서울</option>
                  <option value="경기">경기</option>
                  <option value="인천">인천</option>
                  <option value="강원">강원</option>
                  <option value="충청">충청</option>
                  <option value="전라">전라</option>
                  <option value="경상">경상</option>
                  <option value="제주">제주</option>
                  <option value="해외">해외</option>
                  <option value="자택">자택</option>
                </select>
              </div>
            </div>
            {/*<div className="resume_row">
              <div className="input_title">근무형태</div>
              <div className="resume_input">
                <select className="box_input" defaultValue={wt} ref={wtRef}>
                  <option value="상관없음">상관없음</option>
                  <option value="풀타임">풀타임</option>
                  <option value="파트타임">파트타임</option>
                </select>
              </div>
            </div>*/}
            <div className="resume_row">
              <div className="input_title">예상 금액(월)</div>
              <InputWon pay={pays} onData={pay}></InputWon>
            </div>
            <div className="resume_row">
              <span className="input_title">시작 예정일</span>
              <span className="resume_input focus">
                <input
                  type="date"
                  id="start_dt"
                  name="start_dt"
                  className="box_input"
                  required
                  data-only-word="true"
                  defaultValue={start}
                  ref={startRef}
                />
              </span>
            </div>
            <div className="resume_row">
              <span className="input_title">예상 기간</span>
              <InputMonth month={months} onData={month}></InputMonth>
            </div>

            <div class="btns-area">
              <Link class="btn-m02 btn-color03 depth2" onClick={insertTag}>
                등록
              </Link>
              <Link class="btn-m02 btn-color06 depth2" onClick={closeModal}>
                취소
              </Link>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TagConfigFree;
