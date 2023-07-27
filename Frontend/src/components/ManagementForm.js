import React, { useState, useEffect } from "react";
import "../css/ManagementForm.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ManagementForm = ({ listData, Mode, render, setRender }) => {
  const [activeTab, setActiveTab] = useState("all");
  const [allSchedules, setAllSchedules] = useState([]);
  const [inProgressSchedules, setInProgressSchedules] = useState([]);
  const [ongoingSchedules, setOngoingSchedules] = useState([]);
  const [completedSchedules, setCompletedSchedules] = useState([]);
  const [finishedSchedules, setFinishedSchedules] = useState([]);
  const colors = ["red", "blue", "green", "yellow", "orange"];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  const navigate = useNavigate();

  useEffect(() => {
    setAllSchedules(listData);
    const inprogress = listData.filter(
      (schedule) => schedule.status === "inprogress"
    );
    const completed = listData.filter(
      (schedule) => schedule.status === "completed"
    );
    const ongoing = listData.filter(
      (schedule) => schedule.status === "ongoing"
    );
    const finished = listData.filter(
      (schedule) => schedule.status === "finished"
    );
    setOngoingSchedules(ongoing);
    setInProgressSchedules(inprogress);
    setCompletedSchedules(completed);
    setFinishedSchedules(finished);
    console.log(listData);
  }, [listData]);

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  const modifyCompleted = (schedule) => {
    const confirmed = window.confirm("모집 완료 상태로 변경하시겠습니까?");
    if (confirmed) {
      console.log();
      axios
        .post("http://localhost:8080/auth/modifycompleted", {
          pj_num: schedule.id,
        })
        .then((response) => {
          console.log(response.data);
          setRender(!render);
          navigate(`/client/project`);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  const modifyOngoing = (pjNum) => {
    const confirmed = window.confirm("진행 중으로 상태를 변경하시겠습니까?");
    if (confirmed) {
      axios
        .post("http://localhost:8080/auth/modifyongoing", { pj_num: pjNum })
        .then((response) => {
          console.log(response.data);
          setRender(!render);
          navigate(`/client/project`);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  const modifyFinished = (pjNum) => {
    const confirmed = window.confirm("진행 완료로 상태를 변경하시겠습니까?");
    if (confirmed) {
      axios
        .post("http://localhost:8080/auth/modifyfinished", { pj_num: pjNum })
        .then((response) => {
          console.log(response.data);
          setRender(!render);
          navigate(`/client/project`);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  const handleApprove = (schedule) => {
    const confirmed = window.confirm("해당 프리랜서와 협업하시겠습니까?");
    console.log(schedule);
    if (confirmed) {
      axios
        .post("http://localhost:8080/auth/modifycompletedfree", {
          user_id: schedule.freeid,
          pj_num: schedule.id,
        })
        .then((response) => {
          console.log(response.data);
          setRender(!render);
        })
        .catch((error) => {
          console.error(error);
        });
      axios
        .post(`http://localhost:8080/schedule/insert`, {
          user_id: schedule.freeid,
          schedule_title: schedule.title,
          schedule_content: schedule.content,
          schedule_start: schedule.pj_start,
          schedule_end: schedule.pj_end,
          schedule_color: randomColor,
        })
        .then((r) => {
          console.log("일정 등록 완료");
          setRender(!render);
        })
        .catch((e) => {
          console.error(e);
        });
    }
  };

  const handleReject = (freeid, pjNum) => {
    const confirmed = window.confirm(
      "해당 프리랜서와의 협업을 거절하시겠습니까?"
    );
    if (confirmed) {
      axios
        .post("http://localhost:8080/auth/deletedfree", {
          user_id: freeid,
          pj_num: pjNum,
        })
        .then((response) => {
          console.log(response.data);
          setRender(!render);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  return Mode === "Recruit" ? (
    //Recruit일 경우
    <div className="flex">
      <div className="container-manageform">
        <div className="tab-manageform">
          <button
            className={`button-manageform ${
              activeTab === "all" ? "active" : ""
            }`}
            onClick={() => handleTabClick("all")}
          >
            전체
          </button>
          <button
            className={`button-manageform ${
              activeTab === "inprogress" ? "active" : ""
            }`}
            onClick={() => handleTabClick("inprogress")}
          >
            모집중
          </button>
          <button
            className={`button-manageform ${
              activeTab === "completed" ? "active" : ""
            }`}
            onClick={() => handleTabClick("completed")}
          >
            모집완료
          </button>
          <button
            className={`button-manageform ${
              activeTab === "ongoing" ? "active" : ""
            }`}
            onClick={() => handleTabClick("ongoing")}
          >
            진행중
          </button>
          <button
            className={`button-manageform ${
              activeTab === "finished" ? "active" : ""
            }`}
            onClick={() => handleTabClick("finished")}
          >
            진행완료
          </button>
        </div>
        <div className="listcontainer-manageform">
          <ul className="list-manageform">
            <li>
              <div className="index-manageform">
                <span>프리랜서명</span>
                <span>진행상태</span>
                <span>진행상태변경</span>
              </div>
            </li>
            {activeTab === "all" && (
              <>
                {allSchedules.map((schedule, index) => (
                  <li key={index} className="list-item-manageform">
                    <span onClick={() => navigate(schedule.link)}>
                      {schedule.project}
                    </span>
                    <span>
                      {schedule.status === "completed"
                        ? "모집완료"
                        : schedule.status === "inprogress"
                        ? "모집중"
                        : schedule.status === "ongoing"
                        ? "협업중"
                        : schedule.status === "finished"
                        ? "협업완료"
                        : ""}
                    </span>
                    <span></span>
                  </li>
                ))}
              </>
            )}
            {activeTab === "inprogress" && (
              <>
                {inProgressSchedules.map((schedule, index) => (
                  <li key={index} className="list-item-manageform">
                    <span onClick={() => navigate(schedule.link)}>
                      {schedule.project}
                    </span>
                    <span>
                      {schedule.status === "inprogress" ? "미승낙" : "승낙"}
                    </span>
                    <span>
                      <button
                        onClick={() => handleApprove(schedule)}
                        className="change-status-button"
                      >
                        승낙
                      </button>
                      /
                      <button
                        onClick={() =>
                          handleReject(schedule.freeid, schedule.id)
                        }
                        className="change-status-button"
                      >
                        거절
                      </button>
                    </span>
                  </li>
                ))}
              </>
            )}

            {activeTab === "completed" && (
              <>
                {completedSchedules.map((schedule, index) => (
                  <li key={index} className="list-item-manageform">
                    <span onClick={() => navigate(schedule.link)}>
                      {schedule.project}
                    </span>
                    <span>
                      {schedule.status === "completed" ? "모집완료" : "미승낙"}
                    </span>
                    <span></span>
                  </li>
                ))}
              </>
            )}
            {activeTab === "ongoing" && (
              <>
                {ongoingSchedules.map((schedule, index) => (
                  <li key={index} className="list-item-manageform">
                    <span onClick={() => navigate(schedule.link)}>
                      {schedule.project}
                    </span>
                    <span>
                      {schedule.status === "ongoing" ? "협업중" : "미승낙"}
                    </span>
                    <span></span>
                  </li>
                ))}
              </>
            )}
            {activeTab === "finished" && (
              <>
                {finishedSchedules.map((schedule, index) => (
                  <li key={index} className="list-item-manageform">
                    <span onClick={() => navigate(schedule.link)}>
                      {schedule.project}
                    </span>
                    <span>
                      {schedule.status === "finished" ? "협업완료" : "미승낙"}
                    </span>
                    <span></span>
                  </li>
                ))}
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  ) : (
    //Project일 경우
    <div className="flex">
      <div className="container-manageform">
        <div className="tab-manageform">
          <button
            className={`button-manageform ${
              activeTab === "all" ? "active" : ""
            }`}
            onClick={() => handleTabClick("all")}
          >
            전체
          </button>
          <button
            className={`button-manageform ${
              activeTab === "inprogress" ? "active" : ""
            }`}
            onClick={() => handleTabClick("inprogress")}
          >
            모집중
          </button>
          <button
            className={`button-manageform ${
              activeTab === "completed" ? "active" : ""
            }`}
            onClick={() => handleTabClick("completed")}
          >
            모집완료
          </button>
          <button
            className={`button-manageform ${
              activeTab === "ongoing" ? "active" : ""
            }`}
            onClick={() => handleTabClick("ongoing")}
          >
            진행중
          </button>
          <button
            className={`button-manageform ${
              activeTab === "finished" ? "active" : ""
            }`}
            onClick={() => handleTabClick("finished")}
          >
            완료
          </button>
        </div>
        <div className="listcontainer-manageform">
          <ul className="list-manageform">
            <li>
              <div className="index-manageform">
                <span>프로젝트</span>
                <span>진행상태</span>
                <span>진행상태변경</span>
              </div>
            </li>
            {activeTab === "all" && (
              <>
                {allSchedules.map((schedule) => (
                  <li
                    key={schedule.id}
                    className="list-item-manageform"
                    onClick={() =>
                      navigate(schedule.link, {
                        state: { pj_num: schedule.id },
                      })
                    }
                  >
                    <span>{schedule.project}</span>
                    <span>
                      {schedule.status === "completed"
                        ? "모집완료"
                        : schedule.status === "inprogress"
                        ? "모집중"
                        : schedule.status === "ongoing"
                        ? "진행중"
                        : schedule.status === "finished"
                        ? "진행완료"
                        : ""}
                    </span>
                    <span></span>
                  </li>
                ))}
              </>
            )}

            {activeTab === "inprogress" && (
              <>
                {inProgressSchedules.map((schedule) => (
                  <li
                    key={schedule.id}
                    className="list-item-manageform"
                    onClick={() =>
                      navigate(schedule.link, {
                        state: { pj_num: schedule.id },
                      })
                    }
                  >
                    <span>{schedule.project}</span>
                    <span>모집중</span>
                    <span>
                      <button
                        onClick={() => modifyCompleted(schedule)}
                        className="change-status-button"
                      >
                        모집완료로 변경
                      </button>
                    </span>
                  </li>
                ))}
              </>
            )}

            {activeTab === "completed" && (
              <>
                {completedSchedules.map((schedule) => (
                  <li
                    key={schedule.id}
                    className="list-item-manageform"
                    onClick={() =>
                      navigate(schedule.link, {
                        state: { pj_num: schedule.id },
                      })
                    }
                  >
                    <span>{schedule.project}</span>
                    <span>모집완료</span>
                    <span>
                      <button
                        onClick={() => modifyOngoing(schedule.id)}
                        className="change-status-button"
                      >
                        진행중으로 변경
                      </button>
                    </span>
                  </li>
                ))}
              </>
            )}

            {activeTab === "ongoing" && (
              <>
                {ongoingSchedules.map((schedule) => (
                  <li
                    key={schedule.id}
                    className="list-item-manageform completed"
                    onClick={() =>
                      navigate(schedule.link, {
                        state: { pj_num: schedule.id },
                      })
                    }
                  >
                    <span>{schedule.project}</span>
                    <span>진행중</span>
                    <span>
                      <button
                        onClick={() => modifyFinished(schedule.id)}
                        className="change-status-button"
                      >
                        진행완료로 변경
                      </button>
                    </span>
                  </li>
                ))}
              </>
            )}
            {activeTab === "finished" && (
              <>
                {finishedSchedules.map((schedule) => (
                  <li
                    key={schedule.id}
                    className="list-item-manageform completed"
                    onClick={() =>
                      navigate(schedule.link, {
                        state: { pj_num: schedule.id },
                      })
                    }
                  >
                    <span>{schedule.project}</span>
                    <span>완료</span>
                    <span></span>
                  </li>
                ))}
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ManagementForm;
