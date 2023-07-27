import { useRef, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const SupportBoard = () => {
  const [boardlist, setBoardlist] = useState([]);
  const [page_num, setPage_num] = useState(1);
  const [page_maxnum, setPage_maxnum] = useState(0);
  const [pageLink, setPageLink] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const page_size = 10; // 한 페이지에 나타낼 글 수
  const searchRef = useRef();
  const searchtextRef = useRef();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const storedSearchQuery = searchParams.get("searchQuery");
    if (storedSearchQuery) {
      setSearchQuery(JSON.parse(storedSearchQuery));
      getList();
      getCount();
    } else {
      getList();
      getCount();
    }
  }, []);

  useEffect(() => {
    const searchParams = new URLSearchParams();
    searchParams.set("searchQuery", JSON.stringify(searchQuery));
    navigate(`?${searchParams.toString()}`);
    getList();
  }, [page_num, searchQuery]);

  const handlePage = (page) => {
    setPage_num(page);
  };

  const getCount = () => {
    axios
      .get("http://localhost:8080/support/board/count", {})
      .then((res) => {
        const max = Math.ceil(res.data / page_size);
        setPage_maxnum(max);
        const arr = [];
        for (let i = 1; i <= max; i++) {
          arr.push(i);
        }
        setPageLink(arr);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const getList = () => {
    if (searchQuery.searchNo && searchQuery.searchtext) {
      const searchAPI =
        searchQuery.searchNo === "1"
          ? "http://localhost:8080/support/board/search/subject"
          : "http://localhost:8080/support/board/search/content";

      axios
        .post(searchAPI, {
          sbqsubject: searchQuery.searchtext,
          sbqcontent: searchQuery.searchtext,
        })
        .then((res) => {
          const data = res.data;
          setBoardlist(data);
        })
        .catch((e) => {
          console.error(e);
        });
    } else {
      axios
        .post("http://localhost:8080/support/board/list", {
          page: page_num,
          limit: page_size,
        })
        .then((res) => {
          const data = res.data;
          setBoardlist(data);
        })
        .catch((e) => {
          console.error(e);
        });
    }
  };

  const onSearch = () => {
    const searchNo = searchRef.current.value;
    const searchtext = searchtextRef.current.value;
    const newSearchQuery = { searchNo, searchtext };
    setSearchQuery(newSearchQuery);
    const searchParams = new URLSearchParams();
    searchParams.set("searchQuery", JSON.stringify(newSearchQuery));
    navigate(`?${searchParams.toString()}`);
  };

  const clearSearchQuery = () => {
    setSearchQuery("");
  };

  return (
    <div id="sc">
      <h1>고객센터</h1>
      <hr></hr>
      <div id="sc_tt">
        <Link to="/support">자주하는 질문</Link>
        <Link
          to="/support/board"
          className="sccolor"
          onClick={clearSearchQuery}
        >
          문의 내역
        </Link>
      </div>
      <div className="search-wrapper">
        <div className="search-area">
          <select
            name="searchNo"
            id="id_searchNo"
            title="검색선택창"
            ref={searchRef}
          >
            <option value="1">제목</option>
            <option value="2">내용</option>
          </select>
          <div className="search-box">
            <input
              type="search"
              className="txt"
              name="searchtext"
              id="id_searchtext"
              ref={searchtextRef}
              placeholder="검색어를 입력하세요."
              title="검색어를 입력하세요."
            />
            <input
              type="submit"
              className="btn-search"
              onClick={onSearch}
              value="검색"
            />
          </div>
        </div>
      </div>
      {boardlist.length === 0 || boardlist === undefined ? (
        <div className="sc_bl">
          <table>
            <thead>
              <tr>
                <th className="number">번호</th>
                <th className="title">제목</th>
                <th className="date">작성자</th>
                <th className="date">등록일</th>
                <th className="answer">답변</th>
              </tr>
            </thead>
          </table>
          <div className="noboard">
            <p>아무런 데이터가 없습니다.</p>
          </div>
        </div>
      ) : (
        <>
          <div className="sc_bl">
            <table>
              <thead>
                <tr>
                  <th className="number">번호</th>
                  <th className="title">제목</th>
                  <th className="writer">작성자</th>
                  <th className="date">등록일</th>
                  <th className="answer">답변</th>
                </tr>
              </thead>
              <tbody>
                {boardlist.map((data) => (
                  <tr key={data.sbqnum}>
                    <td className="number">{data.sbqnum}</td>
                    <td className="title left">
                      <Link to={`/support/board/detail/${data.sbqnum}`}>
                        {data.sbqsubject}
                      </Link>
                    </td>
                    <td className="writer">{data.sbqwriter}</td>
                    <td className="date">{data.sbqcreateDate}</td>
                    {data.answerList === null ||
                      data.answerList.length === 0 ||
                      data.answerList.length === undefined ? (
                      <td className="answer">미답변</td>
                    ) : (
                      <td className="answer">답변</td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="sc_bl_page">
            {page_num === 1 ? (
              <></>
            ) : (
              <Link href="#" id="back" onClick={() => handlePage(page_num - 1)}>
                {"<"}
              </Link>
            )}
            {pageLink.map((page) => (
              <Link href="#" id={page} onClick={() => handlePage(page)}>
                {page}
              </Link>
            ))}
            {page_num === page_maxnum ? (
              <></>
            ) : (
              <Link href="#" id="next" onClick={() => handlePage(page_num + 1)}>
                {">"}
              </Link>
            )}
          </div>
        </>
      )}

      <div className="sc_bl_btn">
        <div className="sc_bl_btn-right">
          <Link to="/support/board/write" className="sc_bl_btn-btn">
            글쓰기
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SupportBoard;
