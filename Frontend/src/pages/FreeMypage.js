import React, { useState, useEffect } from "react";
import MySidebar from "../components/my/mySidebar/MySidebar.js";
import "../css/MyLayout.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function FreeMypage() {
  const navigate = useNavigate();
  const goMain = () => {
    navigate("/");
  };
  const [offeredProject, setOfferedProject] = useState([]);
  const [ongoingProject, setOngoingProject] = useState([]);
  const [finishedProject, setFinishedProject] = useState([]);
  const [bookmarkProject, setBookmarkProject] = useState([]);
  const user = window.sessionStorage.getItem("user_id");

  useEffect(() => {
    axios
      .get("http://localhost:8080/auth/inprogresspj", {
        params: { user_id: user },
      })
      .then((response) => {
        setOfferedProject(response.data);
      })
      .catch((error) => {
        console.error(error);
      });

    axios
      .get("http://localhost:8080/auth/freeongoingpj", {
        params: { user_id: user },
      })
      .then((response) => {
        setOngoingProject(response.data);
      })
      .catch((error) => {
        console.error(error);
      });

    axios
      .get("http://localhost:8080/auth/markpjlist", {
        params: { user_id: user },
      })
      .then((response) => {
        setBookmarkProject(response.data);
      })
      .catch((error) => {
        console.error(error);
      });

    axios
      .get("http://localhost:8080/auth/finishedpj", {
        params: { user_id: user },
      })
      .then((response) => {
        setFinishedProject(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <div className="mypageLayout">
      <MySidebar />
      <div className="mywrapper">
        <h4 className="myh4">진행 예정 & 진행 중인 프로젝트</h4>
        {ongoingProject.map((project) => (
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
        <h4 className="myh4">지원한 프로젝트</h4>
        {offeredProject.map((project) => (
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
        <h4 className="myh4">관심 프로젝트</h4>
        {bookmarkProject.map((project) => (
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
        <h4 className="myh4">완료된 프로젝트</h4>
        {finishedProject.map((project) => (
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
      </div>
    </div>
  );
}

export default FreeMypage;
