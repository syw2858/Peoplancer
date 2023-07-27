import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { HiHashtag } from "react-icons/hi";
import "../../css/List.css";

const PjList = () => {
  //project데이터 가져오기
  const [pjlist, setPjlist] = useState([]);
  const pj_jobRef = useRef();
  const pj_dayRef = useRef();
  const pj_work_formRef = useRef("");
  const pj_placeRef = useRef("");
  const searchRef = useRef();
  const searchtextRef = useRef();
  const navigate = useNavigate();
  const location = useLocation();
  const orderbyRef = useRef();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const pj_job = searchParams.get("pj_job");
    const pj_day = searchParams.get("pj_day");
    const pj_work_form = searchParams.get("pj_work_form");
    const searchNo = searchParams.get("searchNo");
    const searchtext = searchParams.get("searchtext");
    const pj_place = searchParams.get("pj_place");
    const orderby = searchParams.get("orderby");
    pj_jobRef.current.value = pj_job || "";
    pj_dayRef.current.value = pj_day || 0;
    pj_work_formRef.current.value = pj_work_form || "";
    searchRef.current.value = searchNo || 0;
    searchtextRef.current.value = searchtext || "";
    pj_placeRef.current.value = pj_place || "";
    orderbyRef.current.value = orderby || "new";
    getPjlistTag(
      pj_job,
      pj_day,
      pj_work_form,
      searchNo,
      searchtext,
      pj_place,
      orderby
    );
  }, [location.search]);
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      const pj_job = pj_jobRef.current.value;
      const pj_day = pj_dayRef.current.value;
      const pj_work_form = pj_work_formRef.current.value;
      const pj_place = pj_placeRef.current.value;
      const orderby = orderbyRef.current.value;
      const searchNo = searchRef.current.value;
      const searchtext = searchtextRef.current.value;
      const searchParams = new URLSearchParams();
      searchParams.set("pj_job", pj_job);
      searchParams.set("pj_day", pj_day);
      searchParams.set("pj_work_form", pj_work_form);
      searchParams.set("pj_place", pj_place);
      searchParams.set("orderby", orderby);
      searchParams.set("searchNo", searchNo);
      searchParams.set("searchtext", searchtext);
      navigate(`?${searchParams.toString()}`);
      getPjlistTag(
        pj_job,
        pj_day,
        pj_work_form,
        searchNo,
        searchtext,
        pj_place,
        orderby
      );
    }
  };
  const handleTagChange = () => {
    const pj_job = pj_jobRef.current.value;
    const pj_day = pj_dayRef.current.value;
    const pj_work_form = pj_work_formRef.current.value;
    const pj_place = pj_placeRef.current.value;
    const orderby = orderbyRef.current.value;
    const searchNo = searchRef.current.value;
    const searchtext = searchtextRef.current.value;
    const searchParams = new URLSearchParams();
    searchParams.set("pj_job", pj_job);
    searchParams.set("pj_day", pj_day);
    searchParams.set("pj_work_form", pj_work_form);
    searchParams.set("pj_place", pj_place);
    searchParams.set("orderby", orderby);
    searchParams.set("searchNo", searchNo);
    searchParams.set("searchtext", searchtext);
    navigate(`?${searchParams.toString()}`);
    getPjlistTag(
      pj_job,
      pj_day,
      pj_work_form,
      searchNo,
      searchtext,
      pj_place,
      orderby
    );
  };

  const getPjlistTag = (
    pj_job,
    pj_day,
    pj_work_form,
    searchNo,
    searchtext,
    pj_place,
    orderby
  ) => {
    axios
      .post("http://localhost:8080/pjlisttag", {
        pj_job: pj_job || "",
        pj_day: pj_day || 0,
        pj_work_form: pj_work_form || "",
        pj_title: searchNo === "0" ? searchtext || "" : "",
        pj_corpname: searchNo === "1" ? searchtext || "" : "",
        pj_place: pj_place || "",
      })
      .then((res) => {
        if (orderby === "old") {
          const data = res.data;
          setPjlist(data);
        } else {
          const data = res.data.slice().reverse();
          setPjlist(data);
        }
      })
      .catch((e) => {
        console.error(e);
      });
  };

  return (
    <div>
      <div className="ListOption">
        <h2>프로젝트 목록</h2>
        <table className="ListFilter">
          <tr>
            <td>
              <select
                className="ListSelect"
                ref={pj_jobRef}
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
              </select>
            </td>
            <td>
              <select
                className="ListSelect"
                ref={pj_dayRef}
                onChange={handleTagChange}
              >
                <option value={0}>근무 기간</option>
                <option value={3}>~3개월</option>
                <option value={6}>3~6개월</option>
                <option value={12}>6개월~1년</option>
                <option value={13}>1년 이상</option>
              </select>
            </td>
            <td>
              <select
                className="ListSelect"
                ref={pj_work_formRef}
                onChange={handleTagChange}
              >
                <option value="">근무 방식</option>
                <option value="원격">원격</option>
                <option value="상주">상주</option>
              </select>
            </td>
            <td>
              <select
                className="ListSelect"
                ref={pj_placeRef}
                onChange={handleTagChange}
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
            </td>
            <td width="60px"></td>
            <td>
              <div className="List-search-area">
                <select
                  name="searchNo"
                  id="id_searchNo"
                  title="검색선택창"
                  ref={searchRef}
                >
                  <option value="0">제목</option>
                  <option value="1">회사명</option>
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
      {pjlist.map((data) => (
        <div className="ListBox" id={data.pj_num}>
          <Link to={`/pjlist/pjdetail/${data.pj_num}`}>
            <div className="ListText">
              <table>
                <tbody>
                  <tr>
                    <td colSpan={2}>
                      <span className="ListJobTag">#{data.pj_job}</span>
                      <span className="ListPossible">
                        모집 마감일 {data.pj_period}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>(주)&nbsp;{data.pj_corpname}&nbsp;&nbsp;|</td>
                    <td className="ListIntro">
                      [{data.pj_level}]&nbsp;{data.pj_title}
                    </td>
                  </tr>
                  <tr style={{ fontSize: "14px" }}>
                    <td colSpan={2}>
                      월&nbsp;{data.pj_pay}&nbsp;&nbsp;|&nbsp;&nbsp;
                      {data.pj_start}&nbsp;~&nbsp;{data.pj_end}
                      &nbsp;&nbsp;|&nbsp;&nbsp;
                      {data.pj_work_form}&nbsp;&nbsp;|&nbsp;&nbsp;
                      {data.pj_place}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={2}>
                      <HiHashtag size="20" />
                      &nbsp;
                      {data.pj_skill}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
};
export default PjList;
