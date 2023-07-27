import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../../css/admin.css";
import AdminSideBar from "../../components/Admin/AdminSideBar";

const AdminUserList = () => {
  //함수
  const [freedb, setFreedb] = useState([]);
  const [edit, setEdit] = useState("");
  const [editpw, setEditpw] = useState("");
  const [editemail, setEditemail] = useState("");
  const [editname, setEditname] = useState("");
  const [edittel, setEdittel] = useState("");
  const [render, setrender] = useState(false);
  const [user, setuser] = useState("");

  const nameChange = (e) => {
    setEditname(e.target.value);
  };
  const telChange = (e) => {
    setEdittel(e.target.value);
  };
  const emailChange = (e) => {
    setEditemail(e.target.value);
  };
  const pwChange = (e) => {
    setEditpw(e.target.value);
  };

  const getfreelancerdb = () => {
    axios
      .get("http://localhost:8080/auth/searchbycode?user_code=free", {})
      .then((res) => {
        const freedata = res.data;
        setFreedb(freedata);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const handleDeleteMember = (e) => {
    e.preventDefault();

    const confirmResult = window.confirm(
      "정말로 삭제하시겠습니까? \n확인을 누르시면 해당 유저의 데이터가 삭제됩니다."
    );

    if (confirmResult) {
      axios
        .post("http://localhost:8080/auth/delete", null, {
          params: {
            user_id: user,
          },
        })
        .then((response) => {
          console.log(response.data);
          alert("해당 유저의 회원탈퇴가 완료되었습니다.");
          setrender(!render);
        })
        .catch((error) => {
          console.error(error);
          alert("회원탈퇴가 취소되었습니다");
        });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const confirmResult = window.confirm(
      "정말로 수정하시겠습니까? \n확인을 누르시면 해당 유저의 데이터가 수정됩니다."
    );
    if (confirmResult) {
      axios
        .post("http://localhost:8080/auth/updateuser", {
          user_id: user,
          user_pw: editpw,
          user_name: editname,
          user_email: editemail,
          user_tel: edittel,
        })
        .then((response) => {
          console.log(response);
          alert("회원정보가 변경되었습니다");
          setEdit("");
          setrender(!render);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  useEffect(() => {
    getfreelancerdb();
  }, [render]);

  return (
    <div className="admin-page">
      <AdminSideBar />
      <div className="main-content1">
        <div id="sc1">
          <h2>출력물(프리랜서리스트)</h2>
          <div className="sc_bl">
            <table>
              <thead>
                <tr>
                  <th className="id1">아이디</th>
                  <th className="pw1">비밀번호</th>
                  <th className="name1">이름</th>
                  <th className="tel1">번호</th>
                  <th className="email1">이메일</th>
                  <th className="fix1">수정</th>
                  <th className="fix1">삭제</th>
                </tr>
              </thead>
              <tbody>
                {freedb.map((data) => (
                  <>
                    <tr>
                      <td className="id1">{data.user_id}</td>
                      <td className="pw1">
                        {/* 비밀번호 */}
                        {edit === data.user_id ? (
                          <>
                            <input
                              type="text"
                              name="user_name"
                              value={editpw || ""}
                              onChange={pwChange}
                            />
                          </>
                        ) : (
                          <>{data.user_pw}</>
                        )}
                      </td>
                      {/* 이름 */}
                      {edit === data.user_id ? (
                        <td className="name1">
                          <input
                            type="text"
                            name="user_name"
                            value={editname || ""}
                            onChange={nameChange}
                          />
                        </td>
                      ) : (
                        <td className="data1">{data.user_name}</td>
                      )}
                      {/* 번호 */}
                      {edit === data.user_id ? (
                        <td className="tel1">
                          <input
                            type="text"
                            name="user_tel"
                            value={edittel || ""}
                            onChange={telChange}
                          />
                        </td>
                      ) : (
                        <td className="data2">{data.user_tel}</td>
                      )}
                      {/* 이메일 */}
                      {edit === data.user_id ? (
                        <td className="email1">
                          <input
                            type="text"
                            name="user_email"
                            value={editemail || ""}
                            onChange={emailChange}
                          />
                        </td>
                      ) : (
                        <td className="data2">{data.user_email}</td>
                      )}
                      {edit === data.user_id ? (
                        <td
                          className="fix1"
                          onClick={(e) => {
                            handleSubmit(e);
                          }}
                        >
                          수정완료
                        </td>
                      ) : (
                        <td
                          className="fix1"
                          onClick={() => {
                            setEdit(`${data.user_id}`);
                            setuser(data.user_id);
                            setEditname(data.user_name);
                            setEdittel(data.user_tel);
                            setEditpw(data.user_pw);
                            setEditemail(data.user_email);
                          }}
                        >
                          수정
                        </td>
                      )}

                      <td
                        className="fix1"
                        onClick={(e) => {
                          setuser(data.user_id);
                          handleDeleteMember(e);
                        }}
                      >
                        삭제
                      </td>
                    </tr>
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUserList;
