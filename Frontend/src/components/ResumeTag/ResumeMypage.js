import "../../css/Resume.css";
import axios from "axios";
import Select from "react-select";
import { Link, useNavigate } from "react-router-dom";
import React, { useState, useRef, useEffect, Component } from "react";
import { occupation, occupations } from "./OccupationData";
import SkillTag from "./SkillTag";
import Resume from "./Resume";
import InputWon from "./InputWon";
import InputCareer from "./InputCareer";
import MySidebar from "../my/mySidebar/MySidebar";
const ResumeMypage = () => {
  const [selectedoccupation, setSelectedOccupation] = useState("");
  const [telvalue, setTelValue] = useState("");
  const user_id = window.sessionStorage.getItem("user_id");

  const nmRef = useRef();
  const jsRef = useRef();
  const bdRef = useRef();
  const maleRef = useRef();
  const femaleRef = useRef();
  const emailRef = useRef();
  const telRef = useRef();
  const jgRef = useRef();
  const jobRef = useRef(null);
  const [skills, setSkills] = useState([]);
  const skill = (data) => {
    setSkills(data);
  };
  const wsRef = useRef();
  const wtRef = useRef();
  const [pays, setPays] = useState(0);
  const pay = (data) => {
    setPays(data);
  };
  const [careers, setCareers] = useState(0);
  const career = (data) => {
    setCareers(data);
  };
  const fileRef = useRef();
  const [fileName, setFileName] = useState("");
  const [fileList, setFileList] = useState();
  const [userdata, setUserdata] = useState();
  const githubRef = useRef();
  const introRef = useRef();
  const [redata, setRedata] = useState();
  const navigate = useNavigate();
  useEffect(() => {
    getuserdata();
  }, []);
  useEffect(() => {
    if (userdata) {
      let val = userdata.user_tel.toString();
      val = val.replace(/[^-\.0-9]/gi, "");
      val = val.replace(/^(\d{3})(\d{4})(\d{4})$/, `$1-$2-$3`);
      setTelValue(val);
    }
  }, [userdata]);
  const getuserdata = () => {
    axios
      .post("http://localhost:8080/user/getuser", {
        user_id: user_id,
      })
      .then((res) => {
        console.log(res.data);
        setUserdata(res.data);
      })
      .catch((e) => {
        console.error(e);
      });
  };
  const handleFileChange = (e) => {
    const uploadFiles = Array.prototype.slice.call(e.target.files);
    uploadFiles.forEach((uploadFile) => {
      setFileList(uploadFile);
    });
    const file = e.target.value.split(/(\\|\/)/g).pop(); // 파일 이름 추출
    setFileName(file);
  };

  const handleValueChange = (event) => {
    let val = event.target.value;
    val = val.replace(/[^-\.0-9]/gi, "");
    val = val.replace(/^(\d{3})(\d{4})(\d{4})$/, `$1-$2-$3`);
    setTelValue(val);
  };

  const onClearSelect = () => {
    if (jobRef.current) {
      jobRef.current.clearValue();
    }
  };
  const [selectedJobs, setSelectedJobs] = useState([]);

  useEffect(() => {
    getResume();
  }, []);

  useEffect(() => {
    if (redata) {
      setSelectedOccupation(redata.user_jg);
      if (redata.user_jg !== null) {
        setSelectedJobs(
          occupation[redata.user_jg].filter((option) =>
            redata.user_job.includes(option.value)
          )
        );
      }
      setFileName(redata.user_orfile);
      setTelValue(redata.user_tel);
    }
  }, [redata]);

  // useEffect(() => {
  //   if (occupation[selectedoccupation]) {
  //     setSelectedJobs(
  //       occupation[selectedoccupation].filter((option) =>
  //         redata.user_job.includes(option.value)
  //       )
  //     );
  //   }
  // }, [selectedoccupation]);

  const getResume = () => {
    axios
      .post("http://localhost:8080/resume/select", {
        user_id: user_id,
      })
      .then((res) => {
        console.log(res.data);
        setRedata(res.data);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const deleteResume = () => {
    axios
      .post("http://localhost:8080/resume/delete", {
        user_id: user_id,
      })
      .then((res) => {
        axios
          .post("http://localhost:8080/user/updater", {
            user_id: user_id,
            user_resume: 0,
          })
          .then((res) => {
            navigate("/free/mypage");
          })
          .catch((e) => {
            console.error(e);
          });
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const updateResume = () => {
    if (nmRef.current.value === "" || nmRef.current.value === undefined) {
      alert("이름을 입력하세요!!!");
      nmRef.current.focus();
      return false;
    }
    if (bdRef.current.value === "" || bdRef.current.value === undefined) {
      alert("생년월일을 입력하세요!!!");
      bdRef.current.focus();
      return false;
    }
    if (emailRef.current.value === "" || emailRef.current.value === undefined) {
      alert("이메일을 입력하세요!!!");
      emailRef.current.focus();
      return false;
    }
    if (telRef.current.value === "" || telRef.current.value === undefined) {
      alert("전화번호를 입력하세요!!!");
      telRef.current.focus();
      return false;
    }
    const formData = new FormData();
    formData.append("uploadfiles", fileList);
    if (fileList === undefined || fileList === null) {
      axios
        .post("http://localhost:8080/resume/update", {
          user_id: user_id,
          user_nm: nmRef.current.value || null,
          user_js: jsRef.current.value || null,
          user_bd: bdRef.current.value || null,
          user_gen: maleRef.current.checked
            ? maleRef.current.value
            : femaleRef.current.checked
            ? femaleRef.current.value
            : null,
          user_email: emailRef.current.value || null,
          user_tel: telRef.current.value || null,
          user_jg: jgRef.current.props.value
            ? jgRef.current.props.value.value
            : null,
          user_job: jobRef.current.props.value
            ? JSON.stringify(
                jobRef.current.props.value.map((option) => option.value)
              )
            : null,
          user_skill: skills ? JSON.stringify(skills) : null,
          user_ws: wsRef.current.value || null,
          user_wt: wtRef.current.value || null,
          user_pay: pays || null,
          user_career: careers || null,
          user_orfile: redata.user_orfile,
          user_stfile: redata.user_stfile,
          user_github: githubRef.current.value || null,
          user_intro: introRef.current.value || null,
        })
        .then((res) => {
          navigate(-1);
        })
        .catch((e) => {
          console.error(e);
        });
    } else {
      axios
        .post("http://localhost:8080/resume/upload", formData)
        .then((res) => {
          axios
            .post("http://localhost:8080/resume/update", {
              user_id: user_id,
              user_nm: nmRef.current.value || null,
              user_js: jsRef.current.value || null,
              user_bd: bdRef.current.value || null,
              user_gen: maleRef.current.checked
                ? maleRef.current.value
                : femaleRef.current.checked
                ? femaleRef.current.value
                : null,
              user_email: emailRef.current.value || null,
              user_tel: telRef.current.value || null,
              user_jg: jgRef.current.props.value
                ? jgRef.current.props.value.value
                : null,
              user_job: jobRef.current.props.value
                ? JSON.stringify(
                    jobRef.current.props.value.map((option) => option.value)
                  )
                : null,
              user_skill: skills ? JSON.stringify(skills) : null,
              user_ws: wsRef.current.value || null,
              user_wt: wtRef.current.value || null,
              user_pay: pays || null,
              user_career: careers || null,
              user_orfile: res.data[0].originfilename || null,
              user_stfile: res.data[0].storedfilename || null,
              user_github: githubRef.current.value || null,
              user_intro: introRef.current.value || null,
            })
            .then((res) => {
              navigate(-1);
            })
            .catch((e) => {
              console.error(e);
            });
        })
        .catch((e) => {
          console.error(e);
        });
    }
  };
  return (
    <div className="reflex">
      <MySidebar />
      {redata ? (
        <div className="resume reflex">
          <div id="basic" className="resume_section">
            <div className="area_title">
              <h3 className="title">이력서</h3>
            </div>

            <div className="resume_write">
              <div className="resume_row">
                <div className="input_title">
                  한줄소개 <span className="point">필수</span>
                </div>
                <div className="resume_input">
                  <input
                    type="url"
                    id="user_url"
                    name="user_url"
                    className="box_input max_length"
                    placeholder="간단한 소개문을 작성해주세요"
                    ref={introRef}
                    defaultValue={redata.user_intro ? redata.user_intro : null}
                  />
                </div>
              </div>
              <div className="resume_row">
                <span className="input_title">
                  이름 <span className="point">필수</span>
                </span>
                <span className="resume_input">
                  <input
                    type="text"
                    id="user_nm"
                    name="user_nm"
                    className="box_input"
                    maxLength="20"
                    defaultValue={redata.user_nm ? redata.user_nm : null}
                    data-only-word="true"
                    placeholder="이름 입력"
                    ref={nmRef}
                  />
                </span>
                <span className="sri_select resume_select resume_right">
                  <select
                    className="ico_arr selected size_type3"
                    defaultValue={redata.user_js ? redata.user_js : null}
                    ref={jsRef}
                  >
                    <option value="work">구직중</option>
                    <option value="notwork">비구직중</option>
                  </select>
                </span>
              </div>
              <div className="resume_row">
                <span className="input_title">
                  생년월일 <span className="point">필수</span>
                </span>
                <span className="resume_input focus">
                  <input
                    type="date"
                    id="birth_day"
                    name="birth_day"
                    className="box_input"
                    data-only-word="true"
                    ref={bdRef}
                    defaultValue={redata.user_bd ? redata.user_bd : null}
                  />
                </span>
                {redata.user_gen ? (
                  redata.user_gen === "male" ? (
                    <span className="inpRdoSw sizeXL resume_right focus">
                      <span className="inOption">
                        <input
                          name="gender"
                          id="male"
                          type="radio"
                          value="male"
                          defaultChecked
                          ref={maleRef}
                        />
                        <label htmlFor="male" name="male" className="lbl">
                          남
                        </label>
                      </span>
                      <span className="inOption">
                        <input
                          name="gender"
                          id="female"
                          type="radio"
                          value="female"
                          ref={femaleRef}
                        />
                        <label htmlFor="female" name="female" className="lbl">
                          여
                        </label>
                      </span>
                    </span>
                  ) : (
                    <span className="inpRdoSw sizeXL resume_right focus">
                      <span className="inOption">
                        <input
                          name="gender"
                          id="male"
                          type="radio"
                          value="male"
                          ref={maleRef}
                        />
                        <label htmlFor="male" name="male" className="lbl">
                          남
                        </label>
                      </span>
                      <span className="inOption">
                        <input
                          name="gender"
                          id="female"
                          type="radio"
                          value="female"
                          checked
                          ref={femaleRef}
                        />
                        <label htmlFor="female" name="female" className="lbl">
                          여
                        </label>
                      </span>
                    </span>
                  )
                ) : (
                  <span className="inpRdoSw sizeXL resume_right focus">
                    <span className="inOption">
                      <input
                        name="gender"
                        id="male"
                        type="radio"
                        value="male"
                        ref={maleRef}
                      />
                      <label htmlFor="male" name="male" className="lbl">
                        남
                      </label>
                    </span>
                    <span className="inOption">
                      <input
                        name="gender"
                        id="female"
                        type="radio"
                        value="female"
                        ref={femaleRef}
                      />
                      <label htmlFor="female" name="female" className="lbl">
                        여
                      </label>
                    </span>
                  </span>
                )}
              </div>
              <div className="resume_row">
                <div className="input_title">
                  이메일 <span className="point">필수</span>
                </div>
                <div className="resume_input focus">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    ref={emailRef}
                    className="box_input max_length"
                    placeholder="이메일 입력"
                    autoComplete="on"
                    defaultValue={redata.user_email ? redata.user_email : null}
                  />
                </div>
              </div>
              <div className="resume_row">
                <div className="input_title">
                  휴대폰 <span className="point">필수</span>
                </div>
                <div className="resume_input">
                  <input
                    type="tel"
                    id="user_tel"
                    name="user_tel"
                    onChange={handleValueChange}
                    value={telvalue}
                    className="box_input max_length"
                    maxLength="13"
                    placeholder="ex)01012345678"
                    ref={telRef}
                  />
                </div>
              </div>
              <div className="resume_row">
                <div className="input_title">직군/직무</div>
                <div className="resume_input">
                  <Select
                    className="basic-single"
                    classNamePrefix="select"
                    placeholder="직군을 선택하세요"
                    name="jobgroup"
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
                <div className="input_title"></div>
                <div className="resume_input">
                  <Select
                    ref={jobRef}
                    isMulti
                    name="jobs"
                    placeholder="직무를 선택하세요"
                    options={occupation[selectedoccupation] || []}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    value={selectedJobs}
                    onChange={(e) => setSelectedJobs(e)}
                  />
                </div>
              </div>
              <SkillTag
                skill={
                  redata.user_skill
                    ? JSON.parse(redata.user_skill || []) || []
                    : []
                }
                onData={skill}
              ></SkillTag>
              <div className="resume_row">
                <div className="input_title">근무방식</div>
                <div className="resume_input">
                  <select
                    className="box_input"
                    name="work_st"
                    defaultValue={redata.user_ws ? redata.user_ws : null}
                    ref={wsRef}
                  >
                    <option value="상관없음">상관없음</option>
                    <option value="상주">상주근무</option>
                    <option value="원격">원격근무</option>
                  </select>
                </div>
              </div>
              <div className="resume_row">
                <div className="input_title">근무형태</div>
                <div className="resume_input">
                  <select
                    className="box_input"
                    name="work_ty"
                    defaultValue={redata.user_wt ? redata.user_wt : null}
                    ref={wtRef}
                  >
                    <option value="상관없음">상관없음</option>
                    <option value="풀타임">풀타임</option>
                    <option value="파트타임">파트타임</option>
                  </select>
                </div>
              </div>
              <div className="resume_row">
                <div className="input_title">희망 금액(월)</div>
                <InputWon
                  pay={redata.user_pay ? redata.user_pay : 0}
                  onData={pay}
                />
              </div>
              <div className="resume_row">
                <span className="input_title">프리랜서 경력</span>
                <InputCareer
                  career={redata.user_career ? redata.user_career : 0}
                  onData={career}
                ></InputCareer>
              </div>
              <div className="resume_row">
                <div className="input_title">포트 폴리오</div>
                <div className="resume_input">
                  <label htmlFor="user_file" className="file_label">
                    파일등록
                  </label>
                  <input
                    className="box_input file_input_size upload-name"
                    value={fileName}
                    placeholder="첨부파일"
                  />
                  <input
                    type="file"
                    id="user_file"
                    name="user_file"
                    className="file_input_hidden"
                    multiple
                    onChange={handleFileChange}
                    ref={fileRef}
                  />
                </div>
              </div>
              <div className="resume_row">
                <div className="input_title">GitHub</div>
                <div className="resume_input">
                  <input
                    type="url"
                    id="user_url"
                    name="user_url"
                    className="box_input max_length"
                    placeholder="ex) https://github.com"
                    defaultValue={
                      redata.user_github ? redata.user_github : null
                    }
                    ref={githubRef}
                  />
                </div>
              </div>
            </div>
            <div className="btns-area">
              <Link
                className="btn-m02 btn-color03 depth2"
                onClick={updateResume}
              >
                수정
              </Link>
              <Link
                className="btn-m02 btn-color06 depth2"
                onClick={() => navigate(-1)}
              >
                취소
              </Link>
              <Link className="btn-m02 btn-color06 flri" onClick={deleteResume}>
                삭제
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <Resume />
      )}
    </div>
  );
};

export default ResumeMypage;
