import "../../css/PjDetail.css";
import { Link } from "react-router-dom";
import { useNavigate, useParams } from "react-router-dom";
import React, { useState } from "react";
import axios from "axios";
import PjReview from "../Review/pj/PjReview";
import { useEffect } from "react";

const PjDetail = () => {
  const navigate = useNavigate();
  const [isSelected, setIsSelected] = useState(false);
  const [project, setProject] = useState([]);
  const [pjlist, setPjlist] = useState([]);
  const [markPj, setMarkPj] = useState("");
  const [register, setRegister] = useState("");

  const user_id = window.sessionStorage.getItem("user_id");
  const { id } = useParams();
  const pj_num = parseInt(id);

  const [userCode, setUserCode] = useState("");
  const handleUserCodeChange = (code) => {
    setUserCode(code);
  };
  console.log("pjdetail userCode: ", userCode);

  const getPjDetail = () => {
    axios
      .get(`http://localhost:8080/pjlist/pjdetail?pj_num=${pj_num}`, {})
      .then((res) => {
        const data = res.data;
        console.log("getdetail data: ", data);
        setProject(data);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const dmchatcreate = () => {
    axios
      .post("http://localhost:8080/createChatroom", {
        my_user_id: user_id,
        your_user_id: project.user_id,
      })
      .then((res) => {
        //console.log(res.data);
      })
      .catch((error) => {
        console.error("/createChatroom 에러 발생" + error);
      });
  };

  useEffect(() => {
    if (isSelected) {
      window.location.reload(); // 페이지 새로고침
      setIsSelected(false);
    }
  }, [isSelected]);

  const onClickSimilarProject = (slist) => {
    navigate(`/pjlist/pjdetail/${slist.pj_num}`);
    setIsSelected(true);
  };

  useEffect(() => {
    getPjDetail();
  }, []);

  useEffect(() => {
    getPjlist();
  }, []);
  const getPjlist = () => {
    axios
      .get("http://localhost:8080/pjlist", {})
      .then((res) => {
        const data = res.data;
        setPjlist(data);
        console.log("getPjlist: ", data);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const onClickDelete = () => {
    console.log("[Delete]pj_num: ", pj_num);
    axios
      .get(`http://localhost:8080/pjdetail/delete?pj_num=${pj_num}`, {})
      .then((res) => {
        alert("프로젝트가 삭제되었습니다.");
        navigate("/pjlist");
      })
      .catch((e) => {
        alert("프로젝트 삭제에 실패했습니다.");
        console.error(e);
      });
  };

  const onClickLike = () => {
    axios
      .post(`http://localhost:8080/auth/register/pj`, {
        user_id: user_id,
        mark_pj_pjnum: pj_num,
      })
      .then((res) => {
        const data = res.data;
        console.log("MarkPj data: ", data);
        setMarkPj(data);
        alert("관심 프로젝트에 등록되었습니다.");
      })
      .catch((e) => {
        console.error(e);
        alert("error: 관심 프로젝트 등록에 실패하였습니다.");
      });
  };

  const onClickRegister = () => {
    axios
      .post(`http://localhost:8080/apply`, {
        user_id: user_id,
        pj_num: pj_num,
      })
      .then((res) => {
        const data = res.data;
        console.log("Register data: ", data);
        setRegister(data);
        alert("지원이 완료되었습니다.");
      })
      .catch((e) => {
        console.error(e);
        alert("error: 지원 실패하였습니다.");
      });
  };

  return (
    <div className="PjContainer" id={project.pj_num}>
      <div className="PjDetail">
        <div className="PjDetailBox1">
          <table width="450px">
            <tbody>
              <tr height="50px">
                <td
                  colSpan={4}
                  align="center"
                  style={{ fontSize: "22px", fontWeight: "bold" }}
                >
                  [{project.pj_level}]&nbsp;{project.pj_title}
                </td>
              </tr>
              <tr>
                <td width="60px" className="info">
                  회사명
                </td>
                <td>(주){project.pj_corpname}</td>
                <td width="60px" className="info">
                  근무 형태/지역
                </td>
                <td>
                  {project.pj_work_form}&nbsp;/&nbsp;{project.pj_place}
                </td>
              </tr>
              <tr>
                <td className="info">시작 예정일</td>
                <td>{project.pj_start}</td>
                <td className="info" width="100px">
                  종료 예정일
                </td>
                <td>{project.pj_end}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="PjDetailBox2">
          <table>
            <tbody key={project.pj_num}>
              <tr>
                <td className="info">모집 마감일</td>
                <td>{project.pj_period}</td>
              </tr>
              <tr>
                <td className="info" width="80px">
                  예상 급여
                </td>
                <td>{project.pj_pay}</td>
              </tr>
              <tr>
                <td className="info">직군</td>
                <td>{project.pj_job}</td>
              </tr>
              <tr>
                <td className="info">고용 인원</td>
                <td>{project.pj_pick}명</td>
              </tr>
              <tr>
                <td className="info">필요 스킬</td>
                <td>{project.pj_skill}</td>
              </tr>
              <tr>
                <td colSpan={2}>
                  <div id="PjContent">{project.pj_content}</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="PjManagement">
          {project.user_id === user_id && (
            <Link to={`/pjdetail/update/${project.pj_num}`}>
              <button className="PjBtn2">프로젝트 수정</button>
            </Link>
          )}
          {project.user_id === user_id && (
            <button className="PjBtn2" onClick={onClickDelete}>
              삭제
            </button>
          )}
        </div>

        <div className="PjReview">
          <details open>
            <summary>회사 평가</summary>
            <div class="tpt">
              <PjReview
                pj_num={pj_num}
                onUsercodeChange={handleUserCodeChange}
              />
            </div>
          </details>
          <br />
        </div>
      </div>

      <aside id="PjAside">
        {userCode === "free" && (
          <div className="PjContact">
            <table>
              <tr>
                <td>
                  <span className="PjLikeBtn" onClick={onClickLike}>
                    ♡&nbsp;관심 프로젝트
                  </span>
                </td>
                <td>
                  <span
                    className="PjDM"
                    onClick={() => {
                      dmchatcreate();
                      navigate(`/direct`);
                    }}
                  >
                    DM
                  </span>
                </td>
              </tr>
            </table>
            <div id="PjApply">
              <span className="PjApplyBtn" onClick={onClickRegister}>
                지원하기
              </span>
            </div>
          </div>
        )}
        <br />
        <div>
          <h3>유사 프로젝트</h3>
          {pjlist
            .filter(
              (list) =>
                list.pj_num !== project.pj_num && list.pj_job === project.pj_job
            )
            .map((slist) => (
              <div
                key={slist.pj_num}
                className="PjSimilar"
                onClick={() => onClickSimilarProject(slist)}
              >
                <p>{slist.pj_title}</p>
                <p>{slist.pj_content}</p>
              </div>
            ))}
        </div>
      </aside>
    </div>
  );
};

export default PjDetail;
