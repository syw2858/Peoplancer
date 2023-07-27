import React, { useState, useEffect } from "react";
import ManagementForm from "./ManagementForm";
import MySidebar from "./my/mySidebar/MySidebar";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";

const RecruitmentManagement = () => {
  const [freelancerData, setFreelancerData] = useState([]);
  const user = window.sessionStorage.getItem("user_id");
  //const { pj_num } = useParams(); //pj_num
  const location = useLocation();
  const pj_num = location.state.pj_num;
  const [render, setRender] = useState(false);
  const rendering = () => {

    setRender(!render);
  }

  useEffect(() => {
    axios
      .post("http://localhost:8080/auth/freelistClient", {
        user_id: user,
        pj_num: pj_num,
      })
      .then((response) => {
        console.log(response);
        const modifiedData = response.data.map((item) => {
          const { pj_num, user_nm, pj_title, pj_status, user_id, pj_start, pj_end, pj_content } = item;
          const link = `/freedetail?user_id=${user_id}`;
          return {
            id: pj_num,
            project: user_nm,
            title: pj_title,
            content: pj_content,
            status: pj_status,
            freeid: user_id,
            pj_start: pj_start,
            pj_end: pj_end,
            link,
          };
        });
        setFreelancerData(modifiedData);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [render]);

  return (
    <div className="flex">
      <MySidebar />
      <ManagementForm listData={freelancerData} Mode="Recruit" render={render} setRender={setRender} />
    </div>
  );
};

export default RecruitmentManagement;
