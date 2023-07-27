import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../css/List.css";

const FreeList = () => {
  const [frlist, setFrlist] = useState([]);
  const user_jgRef = useRef();
  const user_careerRef = useRef();
  const user_wsRef = useRef(null);
  const user_jsRef = useRef(null);
  const searchRef = useRef();
  const searchtextRef = useRef();
  const navigate = useNavigate();
  const location = useLocation();
  const user_wtRef = useRef();
  const orderbyRef = useRef();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const user_jg = searchParams.get("user_jg");
    const user_career = searchParams.get("user_career");
    const user_ws = searchParams.get("user_ws");
    const user_wt = searchParams.get("user_wt");
    const user_js = searchParams.get("user_js");
    const searchNo = searchParams.get("searchNo");
    const searchtext = searchParams.get("searchtext");
    const orderby = searchParams.get("orderby");
    user_jgRef.current.value = user_jg || "";
    user_careerRef.current.value = user_career || 0;
    user_wsRef.current.value = user_ws || "";
    user_wtRef.current.value = user_wt || "";
    user_jsRef.current.value = user_js || "";
    searchRef.current.value = searchNo || 0;
    searchtextRef.current.value = searchtext || "";
    orderbyRef.current.value = orderby || "new";
    getFrlistTag(
      user_jg,
      user_career,
      user_ws,
      user_wt,
      user_js,
      searchNo,
      searchtext,
      orderby
    );
  }, [location.search]);
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      const user_jg = user_jgRef.current.value;
      const user_career = user_careerRef.current.value;
      const user_ws = user_wsRef.current.value;
      const user_wt = user_wtRef.current.value;
      const user_js = user_jsRef.current.value;
      const orderby = orderbyRef.current.value;
      const searchNo = searchRef.current.value;
      const searchtext = searchtextRef.current.value;
      const searchParams = new URLSearchParams();
      searchParams.set("user_jg", user_jg);
      searchParams.set("user_career", user_career);
      searchParams.set("user_ws", user_ws);
      searchParams.set("user_wt", user_wt);
      searchParams.set("user_js", user_js);
      searchParams.set("orderby", orderby);
      searchParams.set("searchNo", searchNo);
      searchParams.set("searchtext", searchtext);
      navigate(`?${searchParams.toString()}`);
      getFrlistTag(
        user_jg,
        user_career,
        user_ws,
        user_wt,
        user_js,
        searchNo,
        searchtext,
        orderby
      );
    }
  };
  const handleTagChange = () => {
    const user_jg = user_jgRef.current.value;
    const user_career = user_careerRef.current.value;
    const user_ws = user_wsRef.current.value;
    const user_wt = user_wtRef.current.value;
    const user_js = user_jsRef.current.value;
    const orderby = orderbyRef.current.value;
    const searchNo = searchRef.current.value;
    const searchtext = searchtextRef.current.value;
    const searchParams = new URLSearchParams();
    searchParams.set("user_jg", user_jg);
    searchParams.set("user_career", user_career);
    searchParams.set("user_ws", user_ws);
    searchParams.set("user_wt", user_wt);
    searchParams.set("user_js", user_js);
    searchParams.set("orderby", orderby);
    searchParams.set("searchNo", searchNo);
    searchParams.set("searchtext", searchtext);
    navigate(`?${searchParams.toString()}`);
    getFrlistTag(
      user_jg,
      user_career,
      user_ws,
      user_wt,
      user_js,
      searchNo,
      searchtext,
      orderby
    );
  };

  const getFrlistTag = (
    user_jg,
    user_career,
    user_ws,
    user_wt,
    user_js,
    searchNo,
    searchtext,
    orderby
  ) => {
    axios
      .post("http://localhost:8080/resume/list", {
        user_jg: user_jg || "",
        user_career: user_career || 0,
        user_ws: user_ws || "",
        user_wt: user_wt || "",
        user_js: user_js || "",
        user_nm: searchNo === "0" ? searchtext || "" : "",
        user_job: searchNo === "1" ? searchtext || "" : "",
        user_skill: searchNo === "2" ? searchtext || "" : "",
      })
      .then((res) => {
        if (orderby === "old") {
          const data = res.data;
          setFrlist(data);
        } else {
          const data = res.data.slice().reverse();
          setFrlist(data);
        }
      })
      .catch((e) => {
        console.error(e);
      });
  };

  return (
    <div>
      <div className="ListOption">
        <h2>프리랜서 목록</h2>
        <table className="ListFilter">
          <tr>
            <td>
              <select
                className="ListSelect"
                ref={user_jgRef}
                onChange={handleTagChange}
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
            <td>
              <select
                className="ListSelect"
                ref={user_careerRef}
                onChange={handleTagChange}
              >
                <option value={0}>근무 경력</option>
                <option value={3}>0~3년</option>
                <option value={6}>3~6년</option>
                <option value={10}>6년~10년</option>
                <option value={11}>10년 이상</option>
              </select>
            </td>
            <td>
              <select
                className="ListSelect"
                ref={user_wsRef}
                onChange={handleTagChange}
              >
                <option value="">근무 방식</option>
                <option value="원격">원격근무</option>
                <option value="상주">상주근무</option>
              </select>
            </td>
            <td>
              <select
                className="ListSelect"
                ref={user_wtRef}
                onChange={handleTagChange}
              >
                <option value="">근무 형태</option>
                <option value="풀타임">풀타임</option>
                <option value="파트타임">파트타임</option>
              </select>
            </td>
            <td>
              <select
                className="ListSelect"
                ref={user_jsRef}
                onChange={handleTagChange}
              >
                <option value="">모집 여부</option>
                <option value="work">모집가능</option>
                <option value="notwork">모집불가능</option>
              </select>
            </td>
            <td width="30px"></td>
            <td>
              <div className="List-search-area">
                <select
                  name="searchNo"
                  id="id_searchNo"
                  title="검색선택창"
                  ref={searchRef}
                >
                  <option value="0">이름</option>
                  <option value="1">직종</option>
                  <option value="2">스킬</option>
                </select>
              </div>
            </td>
            <td>
              <div className="List-search-area">
                <div className="List-search-box">
                  <input
                    type="search"
                    className="List-txt"
                    name="searchtext"
                    id="id_searchtext"
                    ref={searchtextRef}
                    placeholder="검색어를 입력하세요."
                    title="검색어를 입력하세요."
                    onKeyDown={handleKeyPress}
                  />
                  <input
                    type="submit"
                    className="List-btn-search"
                    value="검색"
                    onClick={handleTagChange}
                  />
                </div>
              </div>
            </td>
          </tr>
        </table>
        <hr className="ListHr" />
        <div className="Listnew">
          <select
            id="ListFilter"
            ref={orderbyRef}
            onChange={handleTagChange}
            className="Listnew-box"
          >
            <option value="new">최신순</option>
            <option value="old">오래된순</option>
          </select>
        </div>
      </div>

      <div>
        {frlist.map((freelist) => (
          <div
            className="ListBox"
            onClick={() => {
              navigate(`/freedetail?user_id=${freelist.user_id}`);
            }}
          >
            <div className="ListText">
              <span className="ListJobTag">#{freelist.user_jg}</span>
              <span className="ListPossible">
                {freelist.user_js === "work" ? "모집가능" : "모집불가능"}
              </span>
              <table align="center">
                <tr>
                  <td>{freelist.user_nm}</td>
                  <td className="ListBar">|</td>
                  <td>경력 {freelist.user_career}년</td>
                  <td className="ListBar">|</td>
                  <td>{freelist.user_skill.replace(/\[|\]|"/g, "")}</td>
                </tr>
                <tr>
                  <td colSpan={5} className="ListIntro">
                    " {freelist.user_intro} "
                  </td>
                </tr>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FreeList;
