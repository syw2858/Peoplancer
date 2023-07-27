import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../css/admin.css";

const AdminSideBar = () => {
    const navigate = useNavigate();
    const userid = window.sessionStorage.getItem("user_code");
    const admincheck = () => {
        if (userid !== 'admin') {
            navigate("/");
        }
    }

    const freelancerclick = () => {
        navigate('/admin/free');
    };

    const clientclick = () => {
        navigate('/admin/client');
    };
    const projectclick = () => {
        navigate('/admin/project');
    };
    const mainclick = () => {
        navigate('/admin?mode=default');
    }
    useEffect(() => {
        admincheck();
    }, []);

    return (
        <div className="sidebar-admin">
            <h3>관리자님, 환영합니다</h3><hr />
            <h4 onClick={mainclick}>어드민 메인 페이지(통계)</h4>
            <Link to="/admin?mode=start_end">
                <h5>
                    ┖ 프로젝트 시작/마감
                </h5>
            </Link>
            <Link to="/admin?mode=status">
                <h5>
                    ┖ 프로젝트 진행상태
                </h5>
            </Link>
            <Link to="/admin?mode=skills">
                <h5>
                    ┖ 프로젝트 요구/프리랜서 보유 기술
                </h5>
            </Link>
            <Link to="/admin?mode=usercount">
                <h5>
                    ┖ 월별 회원가입 증감
                </h5>
            </Link>
            <Link to="/admin?mode=support">
                <h5>
                    ┖ 고객센터 게시물 답변/미답변
                </h5>
            </Link>
            <h4 onClick={freelancerclick}>프리랜서 리스트</h4>
            <h4 onClick={clientclick}>클라이언트 리스트</h4>
            <h4 onClick={projectclick}>프로젝트 리스트</h4>
            <h4 className="not_hover">고객센터 리스트</h4>
            <div>
                <Link to="/admin/sca">
                    <h5>
                        ┖ 답변
                    </h5>
                </Link>
                <Link to="/admin/scna">
                    <h5>
                        ┖ 미답변
                    </h5>
                </Link>
            </div>
        </div >
    );
}
export default AdminSideBar;

