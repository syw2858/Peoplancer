import "../../css/PjRegi.css";
import axios from "axios";
import { useRef, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const PjUpdate = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const pj_num = parseInt(id);

  const titleRef = useRef();
  const contentRef = useRef();
  const payRef = useRef();
  const startRef = useRef();
  const endRef = useRef();
  const periodRef = useRef();
  const dayRef = useRef();
  const workformRef = useRef();
  const placeRef = useRef();
  const jobRef = useRef();
  const levelRef = useRef();
  const skillRef = useRef();
  const pickRef = useRef();

  const [pjdetail, setPjdetail] = useState([]);

  useEffect(() => {
    getPjDetail();
  }, []);

  const getPjDetail = () => {
    axios
      .get(`http://localhost:8080/pjlist/pjdetail?pj_num=${pj_num}`, {})
      .then((res) => {
        const data = res.data;
        console.log("getPjDetail: ", data);
        setPjdetail(data);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const handleUpdate = () => {
    console.log("pjdetail.pj_num: ", pjdetail.pj_num);
    axios
      .post(`http://localhost:8080/pjdetail/update`, {
        pj_num: pjdetail.pj_num,
        pj_title: titleRef.current.value,
        pj_corpname: pjdetail.pj_corpname,
        pj_content: contentRef.current.value,
        pj_pay: payRef.current.value,
        pj_start: startRef.current.value,
        pj_end: endRef.current.value,
        pj_period: periodRef.current.value,
        pj_day: pjdetail.pj_day,
        pj_work_form: workformRef.current.value,
        pj_place: placeRef.current.value,
        pj_job: jobRef.current.value,
        pj_level: levelRef.current.value,
        pj_skill: skillRef.current.value,
        pj_pick: pickRef.current.value,
        user_id: "admin",
      })
      .then((res) => {
        const data = res.data;
        console.log("pj_num: ", pjdetail.pj_num);
        console.log("updated data: ", data);
        alert("프로젝트가 수정되었습니다.");
        navigate(`/pjlist/pjdetail/${pj_num}`);
      })
      .catch((e) => {
        console.error(e);
        alert("프로젝트 수정에 실패했습니다.");
        navigate(`/pjlist/pjdetail/${pj_num}`);
      });
  };

  return (
    <div>
      <div className="PjRegister">
        <h3>프로젝트 수정하기</h3>
        <table className="PjRegisterTbl">
          <tr>
            <td>프로젝트명</td>
            <td>
              <input
                type="text"
                size="60"
                defaultValue={pjdetail.pj_title}
                ref={titleRef}
              ></input>
            </td>
          </tr>
          <tr>
            <td>회사명&nbsp;&nbsp;(주)</td>
            <td>&nbsp;&nbsp;{pjdetail.pj_corpname}</td>
          </tr>
          <tr>
            <td>근무 형태 / 지역</td>
            <td>
              <div>
                <select
                  className="selectItem"
                  defaultValue={pjdetail.pj_work_form}
                  ref={workformRef}
                >
                  <option value="원격">원격</option>
                  <option value="상주">상주</option>
                </select>
              </div>
              <div>
                <select
                  className="selectItem"
                  defaultValue={pjdetail.pj_place}
                  ref={placeRef}
                >
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
                defaultValue={pjdetail.pj_start}
                ref={startRef}
              ></input>
            </td>
          </tr>
          <tr>
            <td>종료 예정일</td>
            <td>
              <input
                type="date"
                defaultValue={pjdetail.pj_end}
                ref={endRef}
              ></input>
            </td>
          </tr>
          <tr>
            <td>직군</td>
            <td>
              <select
                className="selectItem"
                defaultValue={pjdetail.pj_job}
                ref={jobRef}
              >
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
                defaultValue={pjdetail.pj_level}
                ref={levelRef}
              >
                <option value="">초급/중급/고급</option>
                <option value="초급">초급</option>
                <option value="중급">중급</option>
                <option value="고급">고급</option>
              </select>
              &nbsp;
              <input
                type="text"
                className="inputPay"
                defaultValue={pjdetail.pj_pay}
                ref={payRef}
              ></input>
            </td>
          </tr>
          <tr>
            <td>모집 마감일</td>
            <td>
              <input
                type="date"
                size="30"
                defaultValue={pjdetail.pj_period}
                ref={periodRef}
              ></input>
            </td>
          </tr>
          <tr>
            <td>고용 인원</td>
            <td>
              <input
                type="text"
                defaultValue={pjdetail.pj_pick}
                ref={pickRef}
              ></input>
            </td>
          </tr>
          <tr>
            <td>필요 스킬</td>
            <td>
              <input
                type="text"
                defaultValue={pjdetail.pj_skill}
                ref={skillRef}
              ></input>
            </td>
          </tr>
          <tr>
            <td>프로젝트 내용</td>
            <td>
              <textarea
                className="PjContent"
                defaultValue={pjdetail.pj_content}
                ref={contentRef}
              ></textarea>
            </td>
          </tr>
        </table>
        <br />
        <button className="PjBtn" onClick={() => handleUpdate()}>
          수정
        </button>
        <button className="PjBtn" onClick={() => navigate(-1)}>
          취소
        </button>
      </div>
    </div>
  );
};

export default PjUpdate;
