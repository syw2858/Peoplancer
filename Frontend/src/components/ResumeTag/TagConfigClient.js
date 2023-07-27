import "../../css/Resume.css";
import Select from "react-select";
import React, { useState, useRef, useEffect } from "react";
import { occupation, occupations } from "./OccupationData";
import Modal from "../supportcenter/modal";
import InputWon from "./InputWon";
import { Link } from "react-router-dom";
import axios from "axios";
import InputCareer from "./InputCareer";
import TagList from "./TagListData";

const TagConfigClient = ({ onRendering }) => {
  const [dropDownList, setDropDownList] = useState(TagList);
  const [selectedoccupation, setSelectedOccupation] = useState("");
  const [selectedJobs, setSelectedJobs] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [redata, setRedata] = useState();
  const user_id = window.sessionStorage.getItem("user_id");
  const user_code = window.sessionStorage.getItem("user_code");
  const jsRef = useRef();
  const [js, setJs] = useState("");
  const jgRef = useRef();
  const jobRef = useRef();
  const skillRef = useRef();
  const [skill, setSkill] = useState([]);
  const [careers, setCareers] = useState(0);
  const career = (data) => {
    setCareers(data);
  };
  const wsRef = useRef();
  const [ws, setWs] = useState("allok");
  const wtRef = useRef();
  const [wt, setWt] = useState("allok");
  const [pays, setPays] = useState(0);
  const pay = (data) => {
    setPays(data);
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
    if (user_code === "client") {
      startstep();
    }
  }, []);
  useEffect(() => {
    if (redata) {
      setWs(redata.user_ws);
      setWt(redata.user_wt);
      setSkill(redata.user_skill.replace(/"/g, ""));
      setJs(redata.user_js);
      setSelectedOccupation(redata.user_jg);
      if (redata.user_job) {
        setSelectedJobs(
          occupation[redata.user_jg].filter((option) =>
            redata.user_job.includes(option.value)
          )
        );
      }
      setCareers(redata.user_career);
      setPays(redata.user_pay);
    }
  }, [redata]);
  const getTag = () => {
    axios
      .post("http://localhost:8080/clitag/select", {
        user_id: user_id,
      })
      .then((res) => {
        setRedata(res.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const insertTag = () => {
    axios
      .post("http://localhost:8080/clitag/select", {
        user_id: user_id,
      })
      .then((res) => {
        const count = res.data;
        if (count === "" || count === null) {
          axios
            .post("http://localhost:8080/clitag/insert", {
              user_id: user_id,
              user_jg: jgRef.current.props.value
                ? jgRef.current.props.value.value
                : null,
              user_job: jobRef.current.props.value
                ? JSON.stringify(jobRef.current.props.value.value)
                : null,
              user_skill: `"${skillRef.current.value}"` || null,
              user_career: careers || null,
              user_js: jsRef.current.value || null,
              user_ws: wsRef.current.value || null,
              user_wt: wtRef.current.value || null,
              user_pay: pays || null,
            })
            .then((res) => {
              axios
                .post("http://localhost:8080/user/updatet", {
                  user_id: user_id,
                  user_tag: 1,
                })
                .then((res) => {
                  console.error(res);
                })
                .catch((e) => {
                  console.error(e);
                });
              getTag();
              onRendering();
              closeModal();
            })
            .catch((error) => {
              console.error(error);
            });
        } else {
          console.log(jobRef.current.props.value);
          axios
            .post("http://localhost:8080/clitag/update", {
              user_id: user_id,
              user_jg: jgRef.current.props.value
                ? jgRef.current.props.value.value
                : null,
              user_job: jobRef.current.props.value
                ? JSON.stringify(jobRef.current.props.value.value)
                : null,
              user_skill: `"${skillRef.current.value}"` || null,
              user_career: careers || null,
              user_js: jsRef.current.value || null,
              user_ws: wsRef.current.value || null,
              user_wt: wtRef.current.value || null,
              user_pay: pays || null,
            })
            .then((res) => {
              axios
                .post("http://localhost:8080/user/updatet", {
                  user_id: user_id,
                  user_tag: 1,
                })
                .then((res) => {
                  getTag();
                  onRendering();
                  closeModal();
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
          setModalOpen(true);
        }
      })
      .catch((e) => {
        console.error(e);
      });
  };

  return (
    <div className="in-bl ig_size">
      <img src="/images/tag-icon.png" onClick={openModal} />
      <Modal
        open={modalOpen}
        close={closeModal}
        header="추천 프리랜서 태그설정"
      >
        <div id="basic" className="resume_section">
          <div className="resume_write">
            <div className="resume_row">
              <div className="input_title">직군/직무</div>
              <div className="resume_input">
                <Select
                  className="basic-single"
                  classNamePrefix="select"
                  placeholder="직군을 선택하세요"
                  name="job"
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
                  ref={jgRef}
                />
              </div>
              <p className="txt_error"></p>
              <div className="input_title"></div>
              <div className="resume_input">
                <Select
                  name="jobs"
                  placeholder="직무를 선택하세요"
                  options={occupation[selectedoccupation]}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  ref={jobRef}
                  value={selectedJobs}
                  onChange={(e) => setSelectedJobs(e)}
                />
              </div>
            </div>
            <div className="resume_row">
              <span className="input_title">스킬</span>
              <div className="resume_input tag_div">
                <div className="tag_input">
                  <input
                    type="search"
                    placeholder="스킬을 입력하세요"
                    className="box_input"
                    id="skill"
                    list="skills"
                    ref={skillRef}
                    defaultValue={skill}
                  />
                  <datalist id="skills" className="custom-datalist">
                    {dropDownList.map((data) => (
                      <option value={data} class="custom-option"></option>
                    ))}
                  </datalist>
                </div>
              </div>
            </div>
            <div className="resume_row">
              <span className="input_title">프리랜서 경력</span>
              <InputCareer career={careers} onData={career}></InputCareer>
            </div>
            <div className="resume_row">
              <div className="input_title">구직여부</div>
              <div className="resume_input">
                <select
                  className="box_input ico_arr selected "
                  defaultValue={js}
                  ref={jsRef}
                >
                  <option value="">상관없음</option>
                  <option value="work">구직중</option>
                  <option value="notwork">비구직중</option>
                </select>
              </div>
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
              <div className="input_title">근무형태</div>
              <div className="resume_input">
                <select className="box_input" defaultValue={wt} ref={wtRef}>
                  <option value="상관없음">상관없음</option>
                  <option value="풀타임">풀타임</option>
                  <option value="파트타임">파트타임</option>
                </select>
              </div>
            </div>
            <div className="resume_row">
              <div className="input_title">희망 금액(월)</div>
              <InputWon pay={pays} onData={pay}></InputWon>
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

export default TagConfigClient;
