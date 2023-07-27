import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./components/Home";
import FreeList from "./components/Freelancer/FreeList";
import FreeDetail from "./components/Freelancer/FreeDetail";
import PjList from "./components/Project/PjList";
import PjDetail from "./components/Project/PjDetail";
import PjRegistration from "./components/Project/PjRegistration";
import PjUpdate from "./components/Project/PjUpdate";
import "./css/Layout.css";
import MyCalendar from "./components/Schedule/MyCalendar";
import ProjectManagement from "./components/ProjectManagement ";
import RecruitmentManagement from "./components/RecruitmentManagement ";
import DirectMessage from "./pages/DirectMessage";
import ClientMypage from "./pages/ClientMypage";
import FreeMypage from "./pages/FreeMypage";
import FreeMyInfo from "./components/my/FreeMyInfo";
import ClientMyInfo from "./components/my/ClientMyInfo";
import Resume from "./components/ResumeTag/Resume";
import SupportBoard from "./components/supportcenter/SupportBoard";
import SupportBoardWrite from "./components/supportcenter/SupportBoardWrite";
import SupportBoardDetail from "./components/supportcenter/SupportBoardDetail";
import SupportBoardModify from "./components/supportcenter/SupportBoardModify";
import SupportCenter from "./components/supportcenter/SupportCenter";
import Notfound from "./components/Notfound";
import TagConfigFree from "./components/ResumeTag/TagConfigFree";
import TagConfigClient from "./components/ResumeTag/TagConfigClient";
import ResumeMypage from "./components/ResumeTag/ResumeMypage";
import Loginform from "./components/Login/Loginform";
import Loginselect from "./components/Login/Loginselect";
import Registerform_1 from "./components/Login/Registerform_1";
import Registerform_2 from "./components/Login/Registerform_2";
import FreeMyProject from "./components/my/FreeMyProject";
import Adminpage from "./pages/Admin/Adminpage";
import APSCA from "./pages/Admin/APSCA";
import APSCNA from "./pages/Admin/APSCNA";
import AdminClientList from "./pages/Admin/AdminClientList";
import AdminUserList from "./pages/Admin/AdminUserList";
import AdminProjectList from "./pages/Admin/AdminProjectList";
import FreeCalendar from "./components/Schedule/FreeCalendar";
import { useState, useEffect } from "react";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  useEffect(() => {}, [isLoggedIn]);
  return (
    <div>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <Layout
                onLogin={handleLogin}
                isLoggedIn={isLoggedIn}
                handleLogout={handleLogout}
              />
            }
          >
            <Route index element={<Home />} />
            <Route path="/freelist" element={<FreeList />} />
            <Route path="/freedetail" element={<FreeDetail />} />
            <Route path="/pjlist" element={<PjList />} />
            <Route path="/pjlist/pjdetail/:id" element={<PjDetail />} />
            <Route path="/pjdetail/update/:id" element={<PjUpdate />} />
            <Route path="/pjdetail/insert" element={<PjRegistration />} />
            <Route path="/free/calendar" element={<MyCalendar />} />
            <Route path="/resume" element={<Resume />} />

            <Route path="/tag" element={<TagConfigFree />} />
            <Route path="/tag2" element={<TagConfigClient />} />
            <Route
              path="/loginform"
              element={<Loginform onLogin={handleLogin} />}
            />
            <Route path="/loginselect" element={<Loginselect />} />
            <Route path="/registerform_1" element={<Registerform_1 />} />
            <Route path="/registerform_2" element={<Registerform_2 />} />
            <Route path="/support" element={<SupportCenter />} />
            <Route path="/direct" element={<DirectMessage />} />
            <Route path="/client/project" element={<ProjectManagement />} />
            <Route
              path="/client/recruit/:id"
              element={<RecruitmentManagement />}
            />
            <Route path="/support/board" element={<SupportBoard />} />
            <Route
              path="/support/board/write"
              element={<SupportBoardWrite />}
            />
            <Route
              path="/support/board/detail/:id"
              element={<SupportBoardDetail />}
            />
            <Route
              path="/support/board/modify"
              element={<SupportBoardModify />}
            />
            <Route path="/free/myproject" element={<FreeMyProject />} />
            <Route path="/client/mypage" element={<ClientMypage />} />
            <Route path="/free/mypage" element={<FreeMypage />} />
            <Route path="/free/myresume" element={<ResumeMypage />} />
            <Route
              path="/free/myinfo"
              element={<FreeMyInfo handleLogout={handleLogout} />}
            />
            <Route
              path="/client/myinfo"
              element={<ClientMyInfo handleLogout={handleLogout} />}
            />
          </Route>
          <Route path="/admin" element={<Adminpage />} />
          <Route path="/admin/sca" element={<APSCA />} />
          <Route path="/admin/scna" element={<APSCNA />} />
          <Route path="/admin/client" element={<AdminClientList />} />
          <Route path="/admin/free" element={<AdminUserList />} />
          <Route path="/admin/project" element={<AdminProjectList />} />
          <Route path="/free/calendar/:id" element={<FreeCalendar />} />

          <Route path="*" element={<Notfound />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
