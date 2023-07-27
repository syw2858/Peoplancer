import "../../css/PjRegi.css";
import { useNavigate } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import axios from "axios";

const PjRegistration = () => {
  const navigate = useNavigate();

  const [info, setInfo] = useState({
    pj_title: "",
    pj_corpname: "",
    pj_content: "",
    pj_pay: "",
    pj_start: "",
    pj_period: "",
    pj_end: "",
    pj_work_form: "",
    pj_place: "",
    pj_job: "",
    pj_level: "",
    pj_skill: "",
    pj_pick: "",
    user_id: "",
  });
  useEffect(() => {
    setInfo((prevInfo) => ({
      ...prevInfo,
      user_id: window.sessionStorage.getItem("user_id"),
    }));
  }, []);
  const titleRef = useRef();
  const corpRef = useRef();
  const contentRef = useRef();
  const payRef = useRef();
  const startRef = useRef();
  const periodRef = useRef();
  const endRef = useRef();
  const workformRef = useRef();
  const placeRef = useRef();
  const jobRef = useRef();
  const levelRef = useRef();
  const skillRef = useRef();
  const pickRef = useRef();

  const handleInsert = () => {
    console.log("handleInsert => pj_title: ", titleRef.current.value);
    if (titleRef.current.value === "" || titleRef.current.value === undefined) {
      alert("프로젝트명을 입력하세요.");
      titleRef.current.focus();
      return false;
    }
    if (corpRef.current.value === "" || corpRef.current.value === undefined) {
      alert("회사명을 입력하세요.");
      corpRef.current.focus();
      return false;
    }
    if (jobRef.current.value === "" || jobRef.current.value === undefined) {
      alert("직군을 선택하세요.");
      jobRef.current.focus();
      return false;
    }
    if (
      contentRef.current.value === "" ||
      contentRef.current.value === undefined
    ) {
      alert("프로젝트 내용을 입력하세요.");
      contentRef.current.focus();
      return false;
    }

    axios
      .post("http://localhost:8080/pjdetail/insert", {
        pj_title: info.pj_title,
        pj_corpname: info.pj_corpname,
        pj_content: info.pj_content,
        pj_pay: info.pj_pay,
        pj_start: info.pj_start,
        pj_period: info.pj_period,
        pj_end: info.pj_end,
        pj_work_form: info.pj_work_form,
        pj_place: info.pj_place,
        pj_job: info.pj_job,
        pj_level: info.pj_level,
        pj_skill: info.pj_skill,
        pj_pick: info.pj_pick,
        user_id: info.user_id,
      })
      .then((res) => {
        const data = res.data;
        console.log(data);
        alert("프로젝트가 등록되었습니다.");
        navigate("/pjlist");
      })
      .catch((e) => {
        console.error(e);
        alert("프로젝트 등록에 실패했습니다.");
        console.log(info);
      });
  };

  return (
    <div>
      <div className="PjRegister">
        <h3>프로젝트 등록하기</h3>
        <table className="PjRegisterTbl">
          <tr>
            <td width="140px">프로젝트명</td>
            <td>
              <input
                type="text"
                size="60"
                placeholder="프로젝트명을 입력하세요"
                ref={titleRef}
                onChange={() =>
                  setInfo((prevInfo) => ({
                    ...prevInfo,
                    pj_title: titleRef.current.value,
                  }))
                }
              ></input>
            </td>
          </tr>
          <tr>
            <td>회사명&nbsp;&nbsp;(주)</td>
            <td>
              <input
                type="text"
                size="30"
                placeholder="회사명을 입력하세요"
                ref={corpRef}
                onChange={() =>
                  setInfo((prevInfo) => ({
                    ...prevInfo,
                    pj_corpname: corpRef.current.value,
                  }))
                }
              ></input>
            </td>
          </tr>
          <tr>
            <td>근무 형태 / 지역</td>
            <td>
              <div>
                <select
                  className="selectItem"
                  ref={workformRef}
                  onChange={() =>
                    setInfo((prevInfo) => ({
                      ...prevInfo,
                      pj_work_form: workformRef.current.value,
                    }))
                  }
                >
                  <option value="">근무 형태</option>
                  <option value="원격">원격</option>
                  <option value="상주">상주</option>
                </select>
              </div>
              <div>
                <select
                  className="selectItem"
                  ref={placeRef}
                  onChange={() =>
                    setInfo((prevInfo) => ({
                      ...prevInfo,
                      pj_place: placeRef.current.value,
                    }))
                  }
                >
                  <option value="">근무 지역</option>
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
            </td>
          </tr>
          <tr>
            <td>시작 예정일</td>
            <td>
              <input
                type="date"
                size="30"
                ref={startRef}
                onChange={() =>
                  setInfo((prevInfo) => ({
                    ...prevInfo,
                    pj_start: startRef.current.value,
                  }))
                }
              ></input>
            </td>
          </tr>
          <tr>
            <td>종료 예정일</td>
            <td>
              <input
                type="date"
                ref={endRef}
                onChange={() =>
                  setInfo((prevInfo) => ({
                    ...prevInfo,
                    pj_end: endRef.current.value,
                  }))
                }
              ></input>
            </td>
          </tr>
          <tr>
            <td>직군</td>
            <td>
              <select
                className="selectItem"
                ref={jobRef}
                onChange={() =>
                  setInfo((prevInfo) => ({
                    ...prevInfo,
                    pj_job: jobRef.current.value,
                  }))
                }
              >
                <option value="">직군 선택</option>
                <option value="개발">개발</option>
                <option value="경영·비즈니스">경영·비즈니스</option>
                <option value="마케팅·광고">마케팅·광고</option>
                <option value="디자인">디자인</option>
                <option value="미디어">미디어</option>
                <option value="엔지니어링·설계">엔지니어링·설계</option>
                <option value="법률·법집행기관">법률·법집행기관</option>
                <option value="기타">기타</option>
              </select>
            </td>
          </tr>
          <tr>
            <td>예상 급여</td>
            <td>
              <select
                type="text"
                className="selectItem2"
                ref={levelRef}
                onChange={() =>
                  setInfo((prevInfo) => ({
                    ...prevInfo,
                    pj_level: levelRef.current.value,
                  }))
                }
              >
                <option value="">초급/중급/고급</option>
                <option value="초급">초급</option>
                <option value="중급">중급</option>
                <option value="고급">고급</option>
              </select>
              &nbsp;
              <input
                type="text"
                placeholder="예상 급여(월)"
                className="inputPay"
                ref={payRef}
                onChange={() =>
                  setInfo((prevInfo) => ({
                    ...prevInfo,
                    pj_pay: payRef.current.value,
                  }))
                }
              ></input>
            </td>
          </tr>
          <tr>
            <td>모집 마감일</td>
            <td>
              <input
                type="date"
                size="30"
                ref={periodRef}
                onChange={() =>
                  setInfo((prevInfo) => ({
                    ...prevInfo,
                    pj_period: periodRef.current.value,
                  }))
                }
              ></input>
            </td>
          </tr>
          <tr>
            <td>고용 인원</td>
            <td>
              <input
                type="text"
                ref={pickRef}
                placeholder="인원을 입력하세요(명)"
                onChange={() =>
                  setInfo((prevInfo) => ({
                    ...prevInfo,
                    pj_pick: pickRef.current.value,
                  }))
                }
              ></input>
            </td>
          </tr>
          <tr>
            <td>필요 스킬</td>
            <td>
              <input
                type="text"
                placeholder="필요 스킬을 입력하세요"
                ref={skillRef}
                onChange={() =>
                  setInfo((prevInfo) => ({
                    ...prevInfo,
                    pj_skill: skillRef.current.value,
                  }))
                }
              ></input>
            </td>
          </tr>
          <tr>
            <td>프로젝트 내용</td>
            <td>
              <textarea
                className="PjContent"
                placeholder="프로젝트 내용을 입력하세요"
                ref={contentRef}
                onChange={() =>
                  setInfo((prevInfo) => ({
                    ...prevInfo,
                    pj_content: contentRef.current.value,
                  }))
                }
              ></textarea>
            </td>
          </tr>
        </table>
        <br />
        <button className="PjBtn" onClick={() => handleInsert()}>
          등록
        </button>
        &nbsp;&nbsp;
        <button className="PjBtn" onClick={() => navigate(-1)}>
          취소
        </button>
      </div>
    </div>
  );
};

export default PjRegistration;
