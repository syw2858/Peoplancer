import React from "react";
import Slider from "react-slick";
import { useState, useEffect, useRef } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
} from "recharts";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../css/Slideshow.css";
import "../css/Home.css";
import { HiHashtag } from "react-icons/hi";
import axios from "axios";
import TagConfigClient from "./ResumeTag/TagConfigClient";
import TagConfigFree from "./ResumeTag/TagConfigFree";

function PrevArrow(props) {
  const { className, onClick } = props;
  const handleClick = () => {
    if (typeof onClick === "function") {
      onClick();
    }
  };
  return (
    <img
      src="/images/arrow_left.png"
      alt="arrow prev"
      id="left"
      className={className}
      onClick={handleClick}
    ></img>
  );
}
function NextArrow(props) {
  const { className, onClick } = props;
  const handleClick = () => {
    if (typeof onClick === "function") {
      onClick();
    }
  };
  return (
    <img
      src="/images/arrow_right.png"
      alt="arrow next"
      id="right"
      className={className}
      onClick={handleClick}
    ></img>
  );
}
const Home = () => {
  const [combinedData, setCombinedData] = useState([]);
  const navigate = useNavigate();
  const user_id = window.sessionStorage.getItem("user_id");
  const user_code = window.sessionStorage.getItem("user_code");
  const [refrlist, setreFrlist] = useState([]);
  const [repjlist, setrePjlist] = useState([]);
  const [frlist, setFrlist] = useState([]);
  const [pjlist, setPjlist] = useState([]);
  const [newfre, setNewfre] = useState();
  const jgdata = [
    "개발",
    "경영·비즈니스",
    "마케팅·광고",
    "디자인",
    "미디어",
    "엔지니어링·설계",
    "법률·법집행기관",
  ];
  //프리랜서 직군 데이터 배열과, 클라이언트 프로젝트 요구직군 데이터 배열을 합침
  const fetchData = async () => {
    try {
      const pjjgResponses = await Promise.all(
        jgdata.map((jg) =>
          axios.post("http://localhost:8080/pjjgcount", { pj_job: jg })
        )
      );

      const jgResponses = await Promise.all(
        jgdata.map((jg) =>
          axios.post("http://localhost:8080/resume/usjgcount", { user_jg: jg })
        )
      );

      const combinedData = jgdata.map((jg, index) => ({
        name: jg,
        resumedata: jgResponses[index]?.data || 0,
        projectdata: pjjgResponses[index]?.data || 0,
      }));
      setCombinedData(combinedData);
    } catch (error) {
      console.error(error);
    }
  };
  const settings = {
    infinite:
      user_code === "client" ? refrlist.length > 3 : repjlist.length > 3,
    VariableWidthSlide: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };
  const settings2 = {
    infinite: true,
    VariableWidthSlide: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };
  useEffect(() => {
    if (user_code === "free") {
      startstep();
      getPjlistTag();
    } else if (user_code === "client") {
      getFrlistTag();
    }
    fetchData();
    getPjlist();
    getFrlist();
  }, [user_code, user_id]);

  const getFrlist = () => {
    axios
      .post("http://localhost:8080/resume/list", {
        user_jg: "",
        user_career: 0,
        user_ws: "",
        user_wt: "",
        user_js: "",
        user_nm: "",
        user_job: "",
        user_skill: "",
      })
      .then((res) => {
        const data = res.data;
        console.log(res.data);
        setFrlist(data);
      })
      .catch((e) => {
        console.error(e);
      });
  };
  const getFrlistTag = () => {
    axios
      .post("http://localhost:8080/clitag/select", {
        user_id: user_id,
      })
      .then((res) => {
        const data = res.data;
        console.log("asdas", res.data);
        axios
          .post("http://localhost:8080/resume/tag", {
            user_jg: data ? data.user_jg || "" : "",
            user_job: data ? data.user_job || "" : "",
            user_career: data ? data.user_career || 0 : 0,
            user_ws: data ? data.user_ws || "" : "",
            user_wt: data ? data.user_wt || "" : "",
            user_js: data ? data.user_js || "" : "",
            user_skill: data
              ? data.user_skill !== '""'
                ? data.user_skill
                : ""
              : "",
            user_id: user_id,
            user_pay: data ? data.user_pay || 0 : 0,
          })
          .then((res) => {
            const data = res.data;
            console.log("data", data);
            setreFrlist(data);
          })
          .catch((e) => {
            console.error(e);
          });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const getPjlistTag = () => {
    axios
      .post("http://localhost:8080/fretag/select", {
        user_id: user_id,
      })
      .then((res) => {
        const data = res.data;
        axios
          .post("http://localhost:8080/pjtag", {
            pj_job: data !== "" ? data.pj_job || "" : "",
            pj_work_form: data !== "" ? data.pj_work_form || "" : "",
            pj_pay: data !== "" ? data.pj_pay || 0 : 0,
            pj_place: data !== "" ? data.pj_place || "" : "",
            pj_start: data !== "" ? data.pj_start || null : null,
            pj_day: data !== "" ? data.pj_day || 0 : 0,
          })
          .then((res) => {
            const data = res.data;
            console.log("pjdata", res);
            setrePjlist(data);
          })
          .catch((e) => {
            console.error(e);
          });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const getPjlist = () => {
    axios
      .get("http://localhost:8080/pjlist", {})
      .then((res) => {
        const data = res.data;

        setPjlist(data);
      })
      .catch((e) => {
        console.error(e);
      });
  };
  const startstep = () => {
    axios
      .post("http://localhost:8080/user/checkstartRe", {
        user_id: user_id,
        user_code: user_code,
      })
      .then((res) => {
        const data = res.data;
        setNewfre(data);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  return (
    <div className="home">
      <div className="home_btn_area">
        <div className="home_btn">
          {user_code === "client" ? (
            <Link to="/pjdetail/insert">
              <h4>프로젝트 등록</h4>
            </Link>
          ) : user_code === "" || user_code === null ? (
            <Link to="/loginform">
              <h4>프로젝트 등록</h4>
            </Link>
          ) : (
            <h4>프로젝트 등록</h4>
          )}
        </div>
        <div className="home_btn">
          {user_code === "free" ? (
            newfre === 1 ? (
              <Link to="/resume">
                <h4>프리랜서 등록</h4>
              </Link>
            ) : (
              <Link to="/free/myresume">
                <h4>프리랜서 등록</h4>
              </Link>
            )
          ) : user_code === "" || user_code === null ? (
            <Link to="/loginform">
              <h4>프리랜서 등록</h4>
            </Link>
          ) : (
            <h4>프리랜서 등록</h4>
          )}
        </div>
      </div>
      <div className="margin2"></div>
      <div>
        <h2>Peoplancer와 함께 성공적인 비즈니스를 시작해보세요!</h2>
      </div>
      <div className="margin2"></div>
      {user_code === "free" ? (
        <div id="home_show">
          <div className="in-bl-area">
            <h2 className="in-bl">추천 프로젝트</h2>
            <TagConfigFree onRendering={getPjlistTag}></TagConfigFree>
          </div>
          <Slider {...settings}>
            {repjlist
              .slice()
              .reverse()
              .map((data) => (
                <div className="reco_slice">
                  <Link to={`/pjlist/pjdetail/${data.pj_num}`}>
                    <table>
                      <tbody>
                        <tr className="wid5px">
                          <td colSpan={2}>
                            <span className="ListJobTag">#{data.pj_job}</span>
                            <span className="ListPossible">
                              모집 마감일 {data.pj_period}
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td className="ListIntro" colSpan={2}>
                            <p>{data.pj_title}</p>
                          </td>
                        </tr>
                        <tr style={{ fontSize: "14px" }}>
                          <td colSpan={2}>
                            {data.pj_pay}&nbsp;&nbsp;|&nbsp;&nbsp;
                            {data.pj_start}&nbsp;~&nbsp;{data.pj_end}
                            &nbsp;&nbsp;|&nbsp;&nbsp;
                            {data.pj_work_form}&nbsp;&nbsp;|&nbsp;&nbsp;
                            {data.pj_place}
                          </td>
                        </tr>
                        <tr>
                          <td colSpan={2}>
                            (주)&nbsp;{data.pj_corpname}&nbsp;&nbsp;
                          </td>
                        </tr>
                        <tr>
                          <td colSpan={2}>
                            <p>
                              <HiHashtag size="20" />
                              &nbsp;
                              {data.pj_skill}
                            </p>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </Link>
                </div>
              ))}
          </Slider>
          <div className="margin1"></div>
        </div>
      ) : user_code === "client" ? (
        <div id="home_show">
          <div className="in-bl-area">
            <h2 className="in-bl">추천 프리랜서</h2>
            <TagConfigClient onRendering={getFrlistTag}></TagConfigClient>
          </div>
          <Slider {...settings}>
            {refrlist
              .slice()
              .reverse()
              .map((freelist) => (
                <div className="reco_slice">
                  <Link to={`/freedetail?user_id=${freelist.user_id}`}>
                    <table className="margincenter">
                      <tbody>
                        <tr className="wid5px">
                          <td colSpan={2}>
                            <span className="ListJobTag">
                              #{freelist.user_jg}
                            </span>
                            <span className="ListPossible">
                              {freelist.user_js === "work"
                                ? "모집가능"
                                : "모집불가능"}
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td className="ListIntro" colSpan={2}>
                            <p>{freelist.user_intro}</p>
                          </td>
                        </tr>
                        <tr style={{ fontSize: "14px" }}>
                          <td colSpan={2}>
                            월 {freelist.user_pay}만원&nbsp;&nbsp;|&nbsp;&nbsp;
                            경력&nbsp;{freelist.user_career}년
                            &nbsp;&nbsp;|&nbsp;&nbsp;
                            {freelist.user_ws}&nbsp;&nbsp;|&nbsp;&nbsp;
                            {freelist.user_wt}
                          </td>
                        </tr>
                        <tr>
                          <td colSpan={2}>{freelist.user_nm}</td>
                        </tr>
                        <tr>
                          <td colSpan={2}>
                            <p>
                              <HiHashtag size="20" />
                              &nbsp;
                              {freelist.user_skill.replace(/\[|\]|"/g, "")}
                            </p>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </Link>
                </div>
              ))}
          </Slider>
          <div className="margin1"></div>
        </div>
      ) : (
        <></>
      )}

      <div>
        <h1>peoplancer와 협업은 이렇게 시작됩니다!</h1>
        <div
          id="welcome"
          style={{
            backgroundColor: "#FFEBB4",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div style={{ maxWidth: "950px", width: "100%" }}>
            <div style={{ display: "flex" }}>
              <div>
                <img
                  src="images/등록.png"
                  alt="등록 "
                  style={{ width: "200px" }}
                />
                <h3>프로젝트/프리랜서 등록</h3>
              </div>
              <span style={{ display: "block", marginTop: "75px" }}>
                <img
                  src="images/화살표.png"
                  alt="화살표"
                  style={{ width: "50px" }}
                />
              </span>
              <div>
                <img
                  src="images/매칭.png"
                  alt="등록"
                  style={{ width: "200px" }}
                />
                <h3>클라이언트와 프리랜서 매칭</h3>
              </div>
              <span style={{ display: "block", marginTop: "75px" }}>
                <img
                  src="images/화살표.png"
                  alt="화살표"
                  style={{ width: "50px" }}
                />
              </span>
              <div>
                <img
                  src="images/DMDM.png"
                  alt="등록"
                  style={{ width: "200px" }}
                />
                <h3>클라이언트와 프리랜서 DM</h3>
              </div>
              <span style={{ display: "block", marginTop: "75px" }}>
                <img
                  src="images/화살표.png"
                  alt="화살표"
                  style={{ width: "50px" }}
                />
              </span>
              <div>
                <img
                  src="images/계약.png"
                  alt="등록"
                  style={{ width: "200px" }}
                />
                <h3>계약 완료</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="margin1"></div>
      {user_code !== "client" ? (
        <div id="home_show">
          <div className="in-bl-area">
            <h2 className="in-bl">신규 프로젝트</h2>
          </div>
          <Slider {...settings2}>
            {pjlist
              .slice()
              .reverse()
              .map((data) => (
                <div className="reco_slice">
                  <Link to={`/pjlist/pjdetail/${data.pj_num}`}>
                    <table>
                      <tbody>
                        <tr className="wid5px">
                          <td colSpan={2}>
                            <span className="ListJobTag">#{data.pj_job}</span>
                            <span className="ListPossible">
                              모집 마감일 {data.pj_period}
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td className="ListIntro" colSpan={2}>
                            <p>{data.pj_title}</p>
                          </td>
                        </tr>
                        <tr style={{ fontSize: "14px" }}>
                          <td colSpan={2}>
                            {data.pj_pay}&nbsp;&nbsp;|&nbsp;&nbsp;
                            {data.pj_start}&nbsp;~&nbsp;{data.pj_end}
                            &nbsp;&nbsp;|&nbsp;&nbsp;
                            {data.pj_work_form}&nbsp;&nbsp;|&nbsp;&nbsp;
                            {data.pj_place}
                          </td>
                        </tr>
                        <tr>
                          <td colSpan={2}>
                            (주)&nbsp;{data.pj_corpname}&nbsp;&nbsp;
                          </td>
                        </tr>
                        <tr>
                          <td colSpan={2}>
                            <p>
                              <HiHashtag size="20" />
                              &nbsp;
                              {data.pj_skill}
                            </p>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </Link>
                </div>
              ))}
          </Slider>
        </div>
      ) : (
        <></>
      )}
      <div className="margin1"></div>
      {user_code !== "free" ? (
        <div id="home_show">
          <div className="in-bl-area">
            <h2 className="in-bl">신규 프리랜서</h2>
          </div>
          <Slider {...settings2}>
            {frlist
              .slice()
              .reverse()
              .map((freelist) => (
                <div className="reco_slice">
                  <Link to={`/freedetail?user_id=${freelist.user_id}`}>
                    <table className="margincenter">
                      <tbody>
                        <tr className="wid5px">
                          <td colSpan={2}>
                            <span className="ListJobTag">
                              #{freelist.user_jg}
                            </span>
                            <span className="ListPossible">
                              {freelist.user_js === "work"
                                ? "모집가능"
                                : "모집불가능"}
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td className="ListIntro" colSpan={2}>
                            <p>{freelist.user_intro}</p>
                          </td>
                        </tr>
                        <tr style={{ fontSize: "14px" }}>
                          <td colSpan={2}>
                            월 {freelist.user_pay}만원&nbsp;&nbsp;|&nbsp;&nbsp;
                            경력&nbsp;{freelist.user_career}년
                            &nbsp;&nbsp;|&nbsp;&nbsp;
                            {freelist.user_ws}&nbsp;&nbsp;|&nbsp;&nbsp;
                            {freelist.user_wt}
                          </td>
                        </tr>
                        <tr>
                          <td colSpan={2}>{freelist.user_nm}</td>
                        </tr>
                        <tr>
                          <td colSpan={2}>
                            <p>
                              <HiHashtag size="20" />
                              &nbsp;
                              {freelist.user_skill.replace(/\[|\]|"/g, "")}
                            </p>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </Link>
                </div>
              ))}
          </Slider>
        </div>
      ) : (
        <></>
      )}
      <div className="flex">
        <div>
          <h3>&nbsp;&nbsp;프로젝트 요구 기술 / 프리랜서 보유 기술 그래프</h3>
          <BarChart width={1080} height={250} data={combinedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="resumedata" fill="#FFC300" name="프리랜서" />
            <Bar dataKey="projectdata" fill="#FF6347" name="프로젝트" />
          </BarChart>
        </div>
      </div>
    </div>
  );
};
export default Home;
