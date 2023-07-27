import React, { useState, useEffect } from "react";
import '../../css/admin.css';
import AdminSideBar from "../../components/Admin/AdminSideBar";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar } from 'recharts';
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";



const Adminpage = () => {
  const [projectresult, setProjectresult] = useState([]);
  const [bardata, setBardata] = useState([]);
  const [userdata, setUserdata] = useState([]);
  const [combinedData, setCombinedData] = useState([]);
  const [supportData, setSupportData] = useState([]);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const mode = searchParams.get("mode");
  const navigate = useNavigate();
  //선그래프 데이터
  //프로젝트 시작 / 마감 그래프 데이터
  const getprojectlist = async () => {
    let baseUrl = "http://localhost:8080/count";
    const year = 2023;
    const startDate = new Date(year, 0, 1); //1월 1일
    const endDate = new Date(year, 11, 31); //12월 31일
    let pjlistresult = [];

    for (let date = startDate; date <= endDate; date.setMonth(date.getMonth() + 1)) {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const formattedDate = `${year}-${month}`;
      try {
        const responseStart = await axios.get(`${baseUrl}/start?pj_start=${formattedDate}`);
        const responseEnd = await axios.get(`${baseUrl}/end?pj_end=${formattedDate}`);

        const monthName = date.toLocaleString('ko-KR', { month: 'short' });

        pjlistresult.push({
          name: monthName,
          value: responseStart.data,
          value2: responseEnd.data,
        });

      } catch (error) {
        console.error(error);
      }
    }
    setProjectresult(pjlistresult);
  }
  //프로젝트 시작/ 마감 그래프 데이터 끝
  //월별 회원가입 카운트 데이터 시작
  const userdate = () => {
    const baseUrl = "http://localhost:8080/user/userdate";
    const userCode = "free";
    const year = 2023;
    const months = Array.from({ length: 12 }, (_, i) => i + 1); // 1월부터 12월까지의 월 배열 생성
    const requests = months.map((month) =>
      axios.post(baseUrl, { user_code: userCode, year: year, month: month })
    );

    Promise.all(requests)
      .then((responses) => {
        const data = responses.map((response, i) => ({
          name: `${i + 1}월`,
          value: response.data,
        }));
        setUserdata(data);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  //월별 회원가입 카운트 데이터 끝
  //선 그래프 데이터 끝

  //막대그래프 데이터
  // 고객센터 답변/ 미답변 카운트
  const answerData = async () => {
    const baseUrl = "http://localhost:8080/support/board";
    try {
      const [acountResponse, nacountResponse] = await Promise.all([
        axios.get(`${baseUrl}/acount`),
        axios.get(`${baseUrl}/nacount`),
      ]);

      const acount = acountResponse.data;
      const nacount = nacountResponse.data;

      const data = [
        { name: "답변", value: acount },
        { name: "미답변", value: nacount },
      ];
      setSupportData(data);
      console.log(data);
      // 선 그래프에 데이터(data)를 설정하거나 다른 로직에 적용할 수 있음
    } catch (error) {
      console.error(error);
    }
  };
  // 고객센터 답변/ 미답변 카운트 끝

  //클라이언트 프로젝트 요구직군 데이터
  const jgdata = [
    "개발",
    "경영·비즈니스",
    "마케팅·광고",
    "디자인",
    "미디어",
    "엔지니어링·설계",
    "법률·법집행기관",
  ];

  //프리랜서 직군 데이터 배열과, 클라이언트 프로젝트 요구직군 데이터 배열을 합침
  const fetchData = async () => {
    try {
      const pjjgResponses = await Promise.all(jgdata.map((jg) =>
        axios.post("http://localhost:8080/pjjgcount", { pj_job: jg })
      ));

      const jgResponses = await Promise.all(jgdata.map((jg) =>
        axios.post("http://localhost:8080/resume/usjgcount", { user_jg: jg })
      ));

      const combinedData = jgdata.map((jg, index) => ({
        name: jg,
        resumedata: jgResponses[index]?.data || 0,
        projectdata: pjjgResponses[index]?.data || 0,
      }));
      setCombinedData(combinedData);
    } catch (error) {
      console.error(error);
    }
  };


  //프로젝트 진행상황 (모집중, 모집완료, 진행중, 진행완료)에 따른 그래프
  const getpjstatuslist = async () => {
    let baseUrl = "http://localhost:8080/admin";
    const statuslist = [];
    const requests = [
      { name: '모집중', endpoint: 'countInprogress' },
      { name: '모집완료', endpoint: 'countCompleted' },
      { name: '진행중', endpoint: 'countOngoing' },
      { name: '진행완료', endpoint: 'countFinished' },
    ];
    try {
      for (const request of requests) {
        const response = await axios.get(`${baseUrl}/${request.endpoint}`);
        statuslist.push({
          name: request.name,
          value: response.data,
        });
      }
    } catch (error) {
      console.error(error);
    }
    setBardata(statuslist);
  }
  //프로젝트 진행상황 (모집중, 모집완료, 진행중, 진행완료)에 따른 그래프 끝


  //막대그래프 끝
  useEffect(() => {
    getprojectlist();
    getpjstatuslist();
    fetchData();
    userdate();
    answerData();

    if (mode == null || '') {
      navigate('/admin?mode=default');
      return;
    }
  }, []);
  useEffect(() => {
    if (window.sessionStorage.getItem("user_code") !== 'admin') {
      navigate("/");
    }
  }, [mode]);

  const goStart = () => {
    navigate('/admin?mode=start_end');
  }
  const goStatus = () => {
    navigate('/admin?mode=status');
  }
  const goSkill = () => {
    navigate('/admin?mode=skills');
  }
  const goUser = () => {
    navigate('/admin?mode=usercount');
  }
  const goSupport = () => {
    navigate('/admin?mode=support');
  }
  const gomain = () => {
    navigate('/admin?mode=default')
  }



  return (
    <div className="admin-page">
      <AdminSideBar />
      {/* 디폴트 모드 */}
      {mode === 'default' &&
        <div className="main-content">
          <div className="flex">
            <div onClick={goStart}>
              <h3>프로젝트 시작 / 마감 그래프</h3>
              <LineChart width={700} height={300} data={projectresult}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="value" stroke="#FF6347" strokeWidth={3} name="프로젝트 시작" />
                <Line type="monotone" dataKey="value2" stroke="#800080" strokeWidth={3} name="프로젝트 마감" />
              </LineChart>
            </div>
            <div onClick={goStatus}>
              <h3>&nbsp;&nbsp;프로젝트 상태에 따른 그래프</h3>
              <BarChart width={500} height={300} data={bardata}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#FFC300" name="프로젝트 수" />
              </BarChart>
            </div>
          </div>

          <div className="flex">
            <div onClick={goSkill}>
              <h3>&nbsp;&nbsp;프로젝트 요구 기술 / 프리랜서 보유 기술 그래프</h3>
              <BarChart width={1200} height={250} data={combinedData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="resumedata" fill="#FFC300" name="프리랜서" />
                <Bar dataKey="projectdata" fill="#FF6347" name="프로젝트" />
              </BarChart>
            </div>
          </div>

          <div className="flex">
            <div onClick={goUser}>
              <h3>&nbsp;&nbsp;월별 회원가입 증감 그래프</h3>
              <LineChart width={700} height={300} data={userdata}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="value" stroke="#FF6347" strokeWidth={3} name="월별 회원가입 수" />
              </LineChart>
            </div>
            <div onClick={goSupport}>
              <h3>&nbsp;고객센터 게시물 답변 / 미답변 그래프</h3>
              <BarChart width={500} height={300} data={supportData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#008000" name="고객센터 게시물 수" />
              </BarChart>
            </div>
          </div>
        </div>}
      {/* 시작/마감 */}
      {
        mode === 'start_end' &&
        <div className="main-content" onClick={gomain}>
          <h1 className="chart-title">프로젝트 시작 / 마감 그래프</h1>
          <div className="chart-container">
            <LineChart width={900} height={600} data={projectresult}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#FF6347" strokeWidth={3} name="프로젝트 시작" />
              <Line type="monotone" dataKey="value2" stroke="#800080" strokeWidth={3} name="프로젝트 마감" />
            </LineChart>
          </div>
          <table className="project-table">
            <thead>
              <tr>
                <th>Month</th>
                <th>Start</th>
                <th>End</th>
              </tr>
            </thead>
            <tbody>
              {projectresult.map((item, index) => (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td>{item.value}</td>
                  <td>{item.value2}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      }
      {/* 진행상태 */}
      {
        mode === 'status' && <div className="main-content" onClick={gomain}>
          <div>
            <h1 className="chart-title">&nbsp;&nbsp;프로젝트 상태에 따른 그래프</h1>
            <BarChart width={900} height={600} data={bardata}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#FFC300" name="프로젝트 수" />
            </BarChart>
          </div>
          <table className="bardata-table">
            <thead>
              <tr>
                <th>Status</th>
                <th>Count</th>
              </tr>
            </thead>
            <tbody>
              {bardata.map((item, index) => (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td>{item.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      }
      {/* 요구기술 / 보유기술 */}
      {
        mode === 'skills' &&
        <div className="main-content" onClick={gomain}>
          <div>
            <h1>&nbsp;&nbsp;프로젝트 요구 기술 / 프리랜서 보유 기술 그래프</h1>
            <BarChart width={900} height={600} data={combinedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="resumedata" fill="#FFC300" name="프리랜서" />
              <Bar dataKey="projectdata" fill="#FF6347" name="프로젝트" />
            </BarChart>
          </div>
          <table className="combinedData-table">
            <thead>
              <tr>
                <th>Skill</th>
                <th>Resumes</th>
                <th>Projects</th>
              </tr>
            </thead>
            <tbody>
              {combinedData.map((item, index) => (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td>{item.resumedata}</td>
                  <td>{item.projectdata}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      }
      {/* 월별 회원가입 증감 */}
      {
        mode === 'usercount' &&
        <div className="main-content" onClick={gomain}>
          <div>
            <h1>&nbsp;&nbsp;월별 회원가입 증감 그래프</h1>
            <LineChart width={900} height={600} data={userdata}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#FF6347" strokeWidth={3} name="월별 회원가입 수" />
            </LineChart>
          </div>
          <table className="userdata-table">
            <thead>
              <tr>
                <th>Month</th>
                <th>Count</th>
              </tr>
            </thead>
            <tbody>
              {userdata.map((item, index) => (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td>{item.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      }
      {/* 답변 / 미답변 */}
      {
        mode === 'support' &&
        <div className="main-content" onClick={gomain}>
          <div>
            <h1>&nbsp;고객센터 게시물 답변 / 미답변 그래프</h1>
            <BarChart width={900} height={600} data={supportData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#008000" name="고객센터 게시물 수" />
            </BarChart>
          </div>
          <table className="supportData-table">
            <thead>
              <tr>
                <th>Answer</th>
                <th>Count</th>
              </tr>
            </thead>
            <tbody>
              {supportData.map((item, index) => (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td>{item.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      }
    </div >
  );
};

export default Adminpage;
