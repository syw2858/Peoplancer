import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import MySidebar from "./mySidebar/MySidebar";
import "../../css/MyLayout.css";
import "../../css/FreeMyProject.css";
import axios from "axios";

function MyProject() {
  const navigate = useNavigate();
  const [ongoingProject, setOngoingProject] = useState([]);
  const [offeredProject, setOfferedProject] = useState([]);
  const [finishedProject, setFinishedProject] = useState([]);
  const user = window.sessionStorage.getItem("user_id");

  useEffect(() => {
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

  // const handleUpdate = (pj_num) => {
  //   const confirmed = window.confirm("프로젝트를 승낙하시겠습니까?");

  //   if (confirmed) {
  //     axios
  //       .put("http://localhost:8080/auth/updatecompleted", {
  //         user_id: user,
  //         pj_num: pj_num,
  //       })
  //       .then((response) => {
  //         window.location.reload();
  //       })
  //       .catch((error) => {
  //         console.error(error);
  //       });
  //   }
  // };

  // const handleDelete = (pj_num) => {
  //   const confirmed = window.confirm(
  //     "프로젝트를 거절하시겠습니까? \n거절하시면 제안이 삭제됩니다"
  //   );

  //   if (confirmed) {
  //     axios
  //       .post("http://localhost:8080/auth/deleteinprogress", {
  //         user_id: user,
  //         pj_num: pj_num,
  //       })
  //       .then((response) => {
  //         window.location.reload();
  //       })
  //       .catch((error) => {
  //         console.error(error);
  //       });
  //   }
  // };

  // const goDM = async (user_id, pj_num) => {
  //   try {
  //     const response = await axios.get("http://localhost:8080/auth/connectdm", {
  //       params: {
  //         user_id: user,
  //         pj_num: pj_num,
  //       },
  //     });
  //     const { my_user_id, your_user_id } = response.data;
  //     console.log(response.data);

  //     const chatDto2 = {
  //       my_user_id: my_user_id,
  //       your_user_id: your_user_id,
  //     };

  //     const createChatroomResponse = await axios.post(
  //       "http://localhost:8080/createChatroom",
  //       chatDto2
  //     );
  //     const chatroomId = createChatroomResponse.data;
  //     console.log("Chatroom created with Id:", chatroomId);
  //     navigate("/direct");
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  return (
    <div className="mypageLayout">
      <MySidebar />
      <div className="mywrapper">
        <h4 className="myh4">진행중인 프로젝트</h4>
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
        {/* <h4 className="myh4">제안받은 프로젝트</h4>
        {offeredProject.map((project) => (
          <form className="myoffered" key={project.pj_num} id={project.pj_num}>
            <Link
              to={`/pjlist/pjdetail/${project.pj_num}`}
              style={{ textDecoration: "none" }}
            >
              <div className="myofferedProject">
                <p>
                  {project.pj_title?.length > 28
                    ? `${project.pj_title.slice(0, 28)}...`
                    : project.pj_title}
                  <br />
                  {project.pj_corpname}
                </p>
              </div>
            </Link>
            <button
              className="myDMButton"
              type="button"
              onClick={() => goDM(user, project.pj_num)}
            >
              DM
            </button>
            <button
              className="myofferedButton"
              type="submit"
              onClick={() => handleUpdate(project.pj_num)}
            >
              승낙
            </button>
            <button
              className="myofferedButton"
              type="submit"
              onClick={() => handleDelete(project.pj_num)}
            >
              거부
            </button>
          </form>
        ))} */}
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

export default MyProject;
