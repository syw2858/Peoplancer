import "../../css/Resume.css";
import axios from "axios";
import Select from "react-select";
import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { occupation, occupations } from "./OccupationData";
import SkillTag from "./SkillTag";
import InputWon from "./InputWon";
import InputCareer from "./InputCareer";
const Resume = () => {
  const [selectedoccupation, setSelectedOccupation] = useState("");
  const [telvalue, setTelValue] = useState("");
  const user_id = window.sessionStorage.getItem("user_id");
  const nmRef = useRef();
  const jsRef = useRef();
  const bdRef = useRef();
  const maleRef = useRef(null);
  const femaleRef = useRef(null);
  const emailRef = useRef();
  const telRef = useRef();
  const jgRef = useRef();
  const jobRef = useRef();
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
  const navigate = useNavigate();
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
  const insertResume = () => {
    if (introRef.current.value === "" || introRef.current.value === undefined) {
      alert("한줄소개를 입력하세요!!!");
      nmRef.current.focus();
      return false;
    }
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
    if (!maleRef.current.checked) {
      if (!femaleRef.current.checked) {
        alert("성별을 선택하세요!!!");
        return false;
      }
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
        .post("http://localhost:8080/resume/insert", {
          user_id: user_id,
          user_nm: nmRef.current.value || null,
          user_js: jsRef.current.value || null,
          user_bd: bdRef.current.value || null,
          user_gen: maleRef.current.checked
            ? maleRef.current.value
            : femaleRef.current.value,
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
          user_orfile: null,
          user_stfile: null,
          user_github: githubRef.current.value || null,
          user_intro: introRef.current.value || null,
        })
        .then((res) => {
          axios
            .post("http://localhost:8080/user/updater", {
              user_id: user_id,
              user_resume: 1,
            })
            .then((res) => {
              navigate("/");
            })
            .catch((e) => {
              console.error(e);
            });
        })
        .catch((e) => {
          console.error(e);
        });
    } else {
      axios
        .post("http://localhost:8080/resume/upload", formData)
        .then((res) => {
          axios
            .post("http://localhost:8080/resume/insert", {
              user_id: user_id,
              user_nm: nmRef.current.value || null,
              user_js: jsRef.current.value || null,
              user_bd: bdRef.current.value || null,
              user_gen: maleRef.current.checked
                ? maleRef.current.value
                : femaleRef.current.value,
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
              axios
                .post("http://localhost:8080/user/updater", {
                  user_id: user_id,
                  user_resume: 1,
                })
                .then((res) => {
                  navigate("/");
                })
                .catch((e) => {
                  console.error(e);
                });
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
    <div className="resume recenter">
      <div id="basic" className="resume_section">
        <div className="area_title">
          <h3 className="title">프리랜서(이력서) 등록</h3>
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
                data-only-word="true"
                placeholder="이름 입력"
                ref={nmRef}
                defaultValue={userdata ? userdata.user_name : ""}
              />
            </span>
            <span className="sri_select resume_select resume_right">
              <select className="ico_arr selected size_type3" ref={jsRef}>
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
                defaultValue={userdata ? userdata.user_birth : ""}
              />
            </span>
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
                defaultValue={userdata ? userdata.user_email : ""}
                className="box_input max_length"
                placeholder="이메일 입력"
                autoComplete="on"
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
                name="color"
                options={occupations}
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
                name="colors"
                placeholder="직무를 선택하세요"
                options={occupation[selectedoccupation]}
                className="basic-multi-select"
                classNamePrefix="select"
              />
            </div>
          </div>
          <SkillTag skill={[]} onData={skill}></SkillTag>
          <div className="resume_row">
            <div className="input_title">근무방식</div>
            <div className="resume_input">
              <select className="box_input" name="work_st" ref={wsRef}>
                <option value="상관없음">상관없음</option>
                <option value="상주">상주근무</option>
                <option value="원격">원격근무</option>
              </select>
            </div>
          </div>
          <div className="resume_row">
            <div className="input_title">근무형태</div>
            <div className="resume_input">
              <select className="box_input" name="work_ty" ref={wtRef}>
                <option value="상관없음">상관없음</option>
                <option value="풀타임">풀타임</option>
                <option value="파트타임">파트타임</option>
              </select>
            </div>
          </div>
          <div className="resume_row">
            <div className="input_title">희망 금액(월)</div>
            <InputWon pay={0} onData={pay} />
          </div>
          <div className="resume_row">
            <span className="input_title">프리랜서 경력</span>
            <InputCareer career={0} onData={career}></InputCareer>
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
                ref={githubRef}
              />
            </div>
          </div>
        </div>
        <div className="btns-area">
          <Link className="btn-m02 btn-color03 depth2" onClick={insertResume}>
            등록
          </Link>
          <Link to="/" className="btn-m02 btn-color06 depth2">
            넘기기
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Resume;
