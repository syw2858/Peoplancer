import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import "../../css/admin.css";
import AdminSideBar from "../../components/Admin/AdminSideBar";

const AdminProjectList = () => {
  const [pjlist, setPjlist] = useState([]);

  useEffect(() => {
    getPjlist();
  }, []);
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

  //함수
  return (
    <div className="admin-page">
      <AdminSideBar />
      <div className="main-content1">
        <div id="sc1">
          <h2>등록된 프로젝트 목록</h2>
          <div className="sc_bl">
            <table>
              <thead>
                <tr>
                  <th className="number">번호</th>
                  <th className="title">프로젝트명</th>
                  <th className="name1">회사명</th>
                  <th className="name1">직군</th>
                  <th className="name1">모집 마감일</th>
                </tr>
              </thead>
              {pjlist.map((data) => (
                <tbody>
                  <tr>
                    <td className="num">{data.pj_num}</td>
                    <td className="title left">
                      <Link to={`/pjlist/pjdetail/${data.pj_num}`}>
                        {data.pj_title}
                      </Link>
                    </td>
                    <td className="corpname">{data.pj_corpname}</td>
                    <td className="job">{data.pj_job}</td>
                    <td className="end">{data.pj_end}</td>
                  </tr>
                </tbody>
              ))}
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProjectList;
