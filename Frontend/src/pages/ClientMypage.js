import React, { useState, useEffect } from "react";
import MySidebar from "../components/my/mySidebar/MySidebar.js";
import "../css/MyLayout.css";
import axios from "axios";
import { Link } from "react-router-dom";

function ClientMypage() {
  const [recruitProject, setRecruitProject] = useState([]);
  const [bookmarkFreelancer, setBookmarkFreelancer] = useState([]);
  const user = window.sessionStorage.getItem("user_id");

  useEffect(() => {
    axios
      .get("http://localhost:8080/auth/ongoingpj", {
        params: { user_id: user },
      })
      .then((response) => {
        setRecruitProject(response.data);
      })
      .catch((error) => {
        console.error(error);
      });

    axios
      .get("http://localhost:8080/auth/markfreelist", {
        params: { user_id: user },
      })
      .then((response) => {
        setBookmarkFreelancer(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <div className="mypageLayout">
      <MySidebar />
      <div className="mywrapper">
        <h4 className="myh4">진행중인 프로젝트</h4>
        {recruitProject.map((project) => (
          <Link
            to={`/pjlist/pjdetail/${project.pj_num}`}
            style={{ textDecoration: "none" }}
          >
            <div className="myproject">
              {project.pj_title}
              <br />
              {project.pj_corpname}
            </div>
          </Link>
        ))}
        <h4 className="myh4">관심 프리랜서</h4>
        {bookmarkFreelancer.map((freelancer) => (
          <Link
            to={`/freedetail?user_id=${freelancer.mark_fre_id}`}
            style={{ textDecoration: "none" }}
          >
            <div className="myfreelancer">
              {freelancer.user_nm}
              <br />
              {freelancer.user_skill}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default ClientMypage;
