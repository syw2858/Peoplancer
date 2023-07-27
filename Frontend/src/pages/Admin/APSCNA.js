import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../../css/admin.css";
import AdminSideBar from "../../components/Admin/AdminSideBar";

const APSCNA = () => {
  const [customerdb, setCustomerdb] = useState([]);
  const [page_num, setPage_num] = useState(1);
  const [page_maxnum, setPage_maxnum] = useState(0);
  const [pageLink, setPageLink] = useState([]);
  const page_size = 10;
  const getcustomerdb = () => {
    axios
      .get("http://localhost:8080/support/board/nacount", {})
      .then((res) => {
        console.log("res", res);
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

    axios
      .post("http://localhost:8080/support/board/nalist", {
        page: page_num,
        limit: page_size,
      })
      .then((customerres) => {
        const customerdata = customerres.data;
        setCustomerdb(customerdata);
        console.log(customerres);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  useEffect(() => {
    getcustomerdb();
  }, [page_num]);

  return (
    <div className="admin-page">
      <AdminSideBar />
      <div className="main-content">
        <div id="sc1">
          <h2>고객센터 미답변 리스트</h2>
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
              {customerdb.map((data) => (
                <tbody>
                  <tr>
                    <td className="number">{data.sbqnum}</td>
                    <td className="title left">
                      <Link to={`/support/board/detail/${data.sbqnum}`}>
                        {data.sbqsubject}
                      </Link>
                    </td>
                    <td className="date">{data.sbqwriter}</td>
                    <td className="date">{data.sbqcreateDate}</td>
                    {data.answerList === null ||
                      data.answerList.length === 0 ||
                      data.answerList.length === undefined ? (
                      <td className="answer">미답변</td>
                    ) : (
                      <td className="answer">답변</td>
                    )}
                  </tr>
                </tbody>
              ))}
            </table>
          </div>

          <div className="sc_bl_page">
            {page_num === 1 ? (
              <></>
            ) : (
              <Link
                href="#"
                id="back"
                onClick={() => setPage_num(page_num - 1)}
              >
                {"<"}
              </Link>
            )}
            {pageLink.map((page) => (
              <Link href="#" id={page} onClick={() => setPage_num(page)}>
                {page}
              </Link>
            ))}
            {page_num === page_maxnum ? (
              <></>
            ) : (
              <Link href="#" id="pre" onClick={() => setPage_num(page_num + 1)}>
                {">"}
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default APSCNA;
