import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import "../css/DirectMessage.css";
import axios from "axios";
import FileSaver from "file-saver";

let stompClient = null; // 웹소캣 라이브러리 stomp 객체 입니다. 랜더링이 일어날때마다 소켓 객체를 만들어서 밖으로 꺼냈습니다.

function DirectMessage() {
  const [slide, setSlide] = useState(false); // 좌측 목록 채팅방  or 상세정보
  const [cooperate, setCooperate] = useState(false); // 상세정보 창에서 협력중인지 아닌지에 따라 달라짐
  const [attach, setAttach] = useState(false); // 파일 첨부 버튼 클릭 여부
  const [select, setSelect] = useState(0); // 좌측 사이드바 채팅방 선택 시 변경되는 값 (초기값 0)
  const navigate = useNavigate(); // dm 나가기 버튼
  const [inputchat, setInputchat] = useState("");
  const imageInput = useRef();
  const fileInput = useRef();
  const [imageFile, setImageFile] = useState("");
  const [imgFile, setImgFile] = useState("");
  const [imgFileName, setImgFileName] = useState("");
  const [dmfile, setDmFile] = useState("");
  const [filename, setFileName] = useState("");
  const [chatarraybox, setChatArrayBox] = useState([]);
  const [chatroomarray, setChatRoomArray] = useState([]);
  const inputchatvalue = (e) => {
    setInputchat(e.target.value);
  };
  const onClickImageInput = () => {
    imageInput.current.click();
  };
  const onClickFileInput = () => {
    fileInput.current.click();
  };
  const chatfocus = (e) => {
    e.target.placeholder = "";
  };
  const chatblur = (e) => {
    e.target.placeholder = "메시지를 입력하세요";
  };
  const [chatArray, setChatArray] = useState([]);
  const chatRef = useRef(null);
  const [채팅방몇개, set채팅방몇개] = useState([]);
  const [채팅방코드, set채팅방코드] = useState([]);
  const [채팅방num, set채팅방num] = useState(0);
  const [chatname, setChatname] = useState("");
  const [chatRname, setChatRName] = useState("");
  const [score, setScore] = useState(0);
  const [score2, setScore2] = useState(0);
  const [simplescore, setSimpleScore] = useState(0);
  const [simplescore2, setSimpleScore2] = useState(0);
  const [userInfo, SetUserInfo] = useState({
    user_code: "",
    user_email: "",
    user_id: "",
    user_name: "",
    user_tel: "",
  });
  const [myInfo, SetMyInfo] = useState({
    user_code: "",
    user_email: "",
    user_id: "",
    user_name: "",
    user_tel: "",
  });

  useEffect(() => {
    const chatDiv = chatRef.current;
    chatDiv.scrollTop = chatDiv.scrollHeight;
  }, [chatarraybox]);

  useEffect(() => {
    const chatDiv = chatRef.current;
    chatDiv.scrollTop = chatDiv.scrollHeight;
  }, [chatArray]);

  //window.sessionStorage.setItem("user_id", "aladin"); // 테스트용 로그인 아이디 세션, 채팅할때 이부분 주석
  var login_id = String(window.sessionStorage.getItem("user_id"));

  const isSameDate = (date1, date2) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  const chatroom = () => {
    axios
      .post("http://localhost:8080/chatroom", {
        message_id: "",
        chatroom_id: "",
        user_id: login_id,
        message_content: "",
        img_code: null,
        file_code: null,
        message_date: "",
      })
      .then((res) => {
        //console.log(res);
        const jsonData2 = res.data;
        const data2array = Object.values(jsonData2);
        set채팅방몇개(data2array);
        const userIds = data2array.map((item) => item.user_id);
        if (userIds !== null && userIds.length !== 0) {
          axios // 좌측 채팅방 목록 user_id와 user_code 불러오기
            .post("http://localhost:8080/getcodes", userIds)
            .then((re) => {
              //console.log(re.data);
              const jsonData3 = re.data;
              const data3array = Object.values(jsonData3);
              set채팅방코드(data3array);
            })
            .catch((err) => {
              console.error("/getcodes 에러 발생" + err);
            });
        }
      })
      .catch((error) => {
        console.error("/chatroom axios 에러 발생" + error);
      });
  };

  const chatroomcontent = () => {
    axios
      .post("http://localhost:8080/lookupmsg", {
        message_id: "",
        chatroom_id: 채팅방num,
        user_id: "",
        message_content: "",
        img_code: null,
        file_code: null,
        message_date: "",
      })
      .then((res) => {
        const jsonData1 = res.data;
        const data1array = Object.values(jsonData1).map((item) => {
          const messageDate = new Date(item.message_date);
          const today = new Date();
          const koreaTimeZoneOffset = 9 * 60; // 한국 시간과 UTC 시간의 차이 (분 단위)

          if (isSameDate(messageDate, today)) {
            // 오늘 날짜라면 한국 시간으로 시분초 표시
            messageDate.setMinutes(
              messageDate.getMinutes() + koreaTimeZoneOffset
            );
            const formattedTime = messageDate.toISOString().slice(11, 16); // 'hh:mm' 형식으로 표시
            return {
              ...item,
              message_date: formattedTime,
            };
          } else {
            // 오늘 날짜가 아니면 연월일로 표시
            const formattedDate = messageDate.toISOString().slice(0, 10); // 'yyyy-MM-dd' 형식으로 표시
            return {
              ...item,
              message_date: formattedDate,
            };
          }
        });
        setChatArrayBox(data1array);
      })
      .catch((error) => {
        console.error("/lookupmsg axios 에러 발생" + error);
      });
  };

  const chatRoomQuit = () => {
    axios
      .post("http://localhost:8080/quitChatroom", {
        message_id: "",
        chatroom_id: 채팅방num,
        user_id: login_id,
        message_content: "",
        img_code: null,
        file_code: null,
        message_date: "",
      })
      .then((res) => {
        //console.log("채팅방 나가기 성공");
        set채팅방num(0);
        setSlide(false);
        window.location.reload();
      })
      .catch((error) => {
        console.error("/quitChatroom axios 에러 발생" + error);
      });
  };

  function sendQuit() {
    stompClient.send(
      "/pub/message",
      {},
      JSON.stringify({
        chatroom_id: 채팅방num,
        user_id: login_id,
        message_content: "",
        message_date: Date.now(),
        img_code: null,
        file_code: null,
      })
    );
    chatRoomQuit();
  }

  const chatuserinfo = () => {
    axios
      .get("http://localhost:8080/auth/userinfo", {
        params: {
          user_id: chatname,
        },
      })
      .then((res) => {
        SetUserInfo(res.data);
      })
      .catch((err) => {
        console.error("/auth/userinfo 에러 발생" + err);
      });
  };

  const chatmyinfo = () => {
    axios
      .get("http://localhost:8080/auth/userinfo", {
        params: {
          user_id: login_id,
        },
      })
      .then((res) => {
        SetMyInfo(res.data);
      })
      .catch((err) => {
        console.error("/auth/userinfo 에러 발생" + err);
      });
  };
  const chatuserinfowork = () => {
    axios
      .post("http://localhost:8080/getworkstate", {
        my_user_id: login_id,
        your_user_id: chatname,
      })
      .then((res) => {
        if (res.data.some((item) => item.pj_status === "ongoing")) {
          setCooperate(true);
        } else {
          setCooperate(false);
        }
      })
      .catch((err) => {
        console.error("/getworkstate 에러 발생" + err);
      });
  };

  const chatuserscore = () => {
    axios
      .get("http://localhost:8080/score", {
        params: {
          user_id: chatname,
        },
      })
      .then((res) => {
        var scnum = res.data;
        scnum = scnum.toFixed(1);
        setScore(scnum);
        if (0 <= scnum && scnum < 1) {
          setSimpleScore(0.5);
        } else if (1 <= scnum && scnum < 1.5) {
          setSimpleScore(1);
        } else if (1.5 <= scnum && scnum < 2) {
          setSimpleScore(1.5);
        } else if (2 <= scnum && scnum < 2.5) {
          setSimpleScore(2);
        } else if (2.5 <= scnum && scnum < 3) {
          setSimpleScore(2.5);
        } else if (3 <= scnum && scnum < 3.5) {
          setSimpleScore(3);
        } else if (3.5 <= scnum && scnum < 4) {
          setSimpleScore(3.5);
        } else if (4 <= scnum && scnum < 4.5) {
          setSimpleScore(4);
        } else if (4.5 <= scnum && scnum < 5) {
          setSimpleScore(4.5);
        } else {
          setSimpleScore(5);
        }
      })
      .catch((err) => {
        console.error("/score 에러 발생" + err);
      });
  };

  const chatuserscore2 = () => {
    axios
      .get("http://localhost:8080/score2", {
        params: {
          user_id: chatname,
        },
      })
      .then((res) => {
        var scnum = res.data;
        scnum = scnum.toFixed(1);
        setScore2(scnum);
        if (0 <= scnum && scnum < 1) {
          setSimpleScore2(0.5);
        } else if (1 <= scnum && scnum < 1.5) {
          setSimpleScore2(1);
        } else if (1.5 <= scnum && scnum < 2) {
          setSimpleScore2(1.5);
        } else if (2 <= scnum && scnum < 2.5) {
          setSimpleScore2(2);
        } else if (2.5 <= scnum && scnum < 3) {
          setSimpleScore2(2.5);
        } else if (3 <= scnum && scnum < 3.5) {
          setSimpleScore2(3);
        } else if (3.5 <= scnum && scnum < 4) {
          setSimpleScore2(3.5);
        } else if (4 <= scnum && scnum < 4.5) {
          setSimpleScore2(4);
        } else if (4.5 <= scnum && scnum < 5) {
          setSimpleScore2(4.5);
        } else {
          setSimpleScore2(5);
        }
      })
      .catch((err) => {
        console.error("/score2 에러 발생" + err);
      });
  };

  const alarmchat = () => {
    axios
      .post("http://localhost:8080/alarm", {
        message_id: "",
        chatroom_id: "",
        user_id: login_id,
        message_content: "",
        img_code: null,
        file_code: null,
        message_date: "",
      })
      .then((res) => {
        const chatroomIds = res.data.map((item) => [
          item.chatroom_id,
          item.new_messages,
        ]);
        setChatRoomArray(chatroomIds);
        //console.log(chatroomIds);
      })
      .catch((err) => {
        console.error("/alarm 에러 발생" + err);
      });
  };

  const updatealarmchat = () => {
    axios
      .post("http://localhost:8080/updatealarm", {
        message_id: "",
        chatroom_id: 채팅방num,
        user_id: login_id,
        message_content: "",
        img_code: null,
        file_code: null,
        message_date: "",
      })
      .then((res) => {
        //console.log("업뎃");
      })
      .catch((err) => {
        console.error("/updatealarm 에러 발생" + err);
      });
  };

  useEffect(() => {
    unsubscribe();
    alarmchat();
    connect();
  }, [select]);

  useEffect(() => {
    unsubscribe();
    chatroomcontent();
    chatroom();
    chatuserinfo();
    chatmyinfo();
    chatuserinfowork();
    chatuserscore();
    chatuserscore2();
    alarmchat();
    connect();
  }, [채팅방num]);

  useEffect(() => {
    //unsubscribe();
    updatealarmchat();
    chatroom();
    //alarmchat();
  }, [chatArray]);

  useEffect(() => {
    //unsubscribe();
    //updatealarmchat();
    chatroom();
    alarmchat();
  }, [채팅방몇개]);

  //chatuserinfo();

  function connect() {
    let socket = new SockJS("http://localhost:8080/chat");
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
      //console.log("Connected: " + frame);
      //console.log("1번 채팅방 구독");
      stompClient.subscribe("/sub/" + 채팅방num, function (response) {
        //console.log(response.body); // 채팅 내용인듯?
        var content = JSON.parse(response.body);
        setChatArray((prevChatArray) => {
          const messageDate = new Date(content.message_date);
          const today = new Date();
          const koreaTimeZoneOffset = 9 * 60; // 한국 시간과 UTC 시간의 차이 (분 단위)

          if (isSameDate(messageDate, today)) {
            // 오늘 날짜라면 한국 시간으로 시분초 표시
            messageDate.setMinutes(
              messageDate.getMinutes() + koreaTimeZoneOffset
            );
            const formattedTime = messageDate.toISOString().slice(11, 16); // 'hh:mm' 형식으로 표시
            content.message_date = formattedTime;
          } else {
            // 오늘 날짜가 아니면 연월일로 표시
            const formattedDate = messageDate.toISOString().slice(0, 10); // 'yyyy-MM-dd' 형식으로 표시
            content.message_date = formattedDate;
          }

          if (
            prevChatArray.length === 0 ||
            prevChatArray[prevChatArray.length - 1].msgId !== content.user_id ||
            prevChatArray[prevChatArray.length - 1].msgContent !==
              content.message_content ||
            prevChatArray[prevChatArray.length - 1].msgDate !==
              content.message_date ||
            prevChatArray[prevChatArray.length - 1].img_code !==
              content.img_code ||
            prevChatArray[prevChatArray.length - 1].file_code !==
              content.file_code
          ) {
            return [
              ...prevChatArray,
              {
                msgId: content.user_id,
                msgContent: content.message_content,
                msgDate: content.message_date,
                img_code: content.img_code,
                file_code: content.file_code,
              },
            ];
          } else {
            return prevChatArray;
          }
        });
      });

      /* 
      //--------------------------------- 웹소캣 통신 내용 --------------------------------------------//
      //해당 부분을 보려면 connect() 함수를 useEffect에서 밖으로 빼야합니다.
      console.log(
        "배열 데이터 " +
          JSON.stringify(chatArray) +
          "배열 크기는 " +
          chatArray.length
      );
      */
    });
  }

  // 메시지를 웹소캣에 전달합니다.
  function send() {
    const currentDate = +new Date();

    stompClient.send(
      "/pub/message",
      {},
      JSON.stringify({
        chatroom_id: 채팅방num,
        user_id: login_id,
        message_content: inputchat,
        message_date: currentDate,
        img_code: null,
        file_code: null,
      })
    );
    setInputchat("");
  }

  function unsubscribe() {
    if (stompClient) {
      updatealarmchat();
      stompClient.disconnect();
      //console.log("연결해제");
    }
  }

  function download(dmfilenam) {
    const formData = new FormData();
    formData.append("fileName", dmfilenam);

    axios
      .post("http://localhost:8080/file-download", formData, {
        responseType: "blob",
      })
      .then((response) => {
        FileSaver.saveAs(response.data, dmfilenam);
      });
  }

  return (
    <div className="dmContent-div">
      {slide === false ? (
        <div className="dmLft-div2">
          {채팅방몇개.length === 0 ? (
            <div className="dmchatbox">
              <div
                className="dmchatbox-noone"
                style={{ marginTop: "3.2083vw" }}
              >
                아직 대화 상대가 없습니다.
              </div>
              <div className="dmchatbox-noone">새로운 상대를 추가해보세요!</div>
              <div className="dmchatbox-noone-image"></div>
            </div>
          ) : (
            채팅방몇개.map(function (i, num) {
              const userCode = 채팅방코드.find(
                (k) => k.user_id === i.user_id
              )?.user_code;
              return (
                <div
                  className="dmchat-room-select"
                  onClick={() => {
                    setChatArray([]);
                    setSelect(num + 1);
                    set채팅방num(i.chatroom_id);
                    setChatname(i.user_id);
                    setChatRName(i.user_name);
                    chatuserinfowork();
                  }}
                >
                  {userCode === "free" ? (
                    <div className="dmprofile-photo"></div>
                  ) : (
                    <div className="dmprofile-photo-tmp"></div>
                  )}

                  <div className="dmprofile-name">{i.user_name}</div>
                  {chatroomarray.some((item) => item[0] === i.chatroom_id) ? (
                    <div className="dmprofile-notify">
                      {
                        chatroomarray.find(
                          (item) => item[0] === i.chatroom_id
                        )[1]
                      }
                    </div>
                  ) : null}

                  {select === num + 1 ? (
                    <div className="dmprofile-line"></div>
                  ) : null}
                  <div className="dmprofile-content">{i.message_content}</div>
                </div>
              );
            })
          )}
        </div>
      ) : (
        <>
          <div className="dmLft-div">
            <>
              {userInfo.user_code === "free" ? (
                <div
                  className="dmdetail-profile-freelancer"
                  onClick={() => {
                    setSlide(!slide);
                  }}
                ></div>
              ) : (
                <div
                  className="dmdetail-profile-enterprise"
                  onClick={() => {
                    setSlide(!slide);
                  }}
                ></div>
              )}
            </>

            <div className="dmdetail-bottom">
              {/* 해당 값을 뭐 받아온 데이터[select] 이런식으로*/}
              <div className="dmdetail-name">{chatRname}</div>
              <div className="dmdetail-email">{userInfo.user_email}</div>
              <div className="dmdetail-telephone">{userInfo.user_tel}</div>
              {userInfo.user_code === "free" ? (
                <>
                  <div className="dmdetail-score">평점 {score} / 5.0</div>
                  <img
                    src={"DirectMessage/" + simplescore + ".png"}
                    alt="score"
                    className="dmdetail-score-image"
                  ></img>
                </>
              ) : (
                <>
                  <div className="dmdetail-score">평점 {score2} / 5.0</div>
                  <img
                    src={"DirectMessage/" + simplescore2 + ".png"}
                    alt="score"
                    className="dmdetail-score-image"
                  ></img>
                </>
              )}

              <div className="dmdetail-line"></div>
              {cooperate ? (
                <>
                  <div className="dmcorporation-img"></div>
                  <div className="dmcorporation-text">협 업 중</div>
                </>
              ) : (
                <div className="dmnot-cooperate">협업중인 기업이 아닙니다</div>
              )}
              <div
                className="dmroomquit"
                onClick={() => {
                  if (window.confirm("채팅방을 나가시겠습니까?")) {
                    sendQuit();
                  } else {
                  }
                }}
              >
                나가기
              </div>
            </div>
          </div>
        </>
      )}

      <div className="dmRgt-div-top">
        <div
          className="dmundo-button"
          onClick={() => {
            navigate(-1);
          }}
        ></div>
        <div className="dmRgt-center-div">
          {chatname === "" ? (
            <div className="dmRgt-center-logo-image"></div>
          ) : userInfo.user_code === "free" ? (
            <img
              className="dmRgt-center-div-profile"
              src="DirectMessage/freelancer1.png"
              alt="profile2"
            ></img>
          ) : (
            <img
              className="dmRgt-center-div-profile"
              src="DirectMessage/enterprise1.png"
              alt="profile2"
            ></img>
          )}

          <div className="dmRgt-center-div-name">{chatRname}</div>
        </div>
        <div
          className="dminformation-button"
          onClick={() => {
            if (채팅방num === 0) {
            } else {
              setSlide(!slide);
            }
          }}
        ></div>
        <div className="dmdvide-line"></div>
      </div>
      <div className="dmRgt-div-bottom" ref={chatRef}>
        {chatname === "" ? (
          <>
            <div className="dmRgt-div-bottom-image">
              맞춤형 매칭, 협력의 첫 걸음
            </div>
            <div className="dmRgt-div-bottom-add"></div>
          </>
        ) : (
          chatarraybox.map(function (i, index) {
            // DB에 있는 메시지를 채팅창에 표시하는 부분
            return (
              <>
                {i.user_id === login_id ? (
                  <>
                    {index === 0 ||
                    i.user_id !== chatarraybox[index - 1].user_id ? (
                      <>
                        {myInfo.user_code === "free" ? (
                          <img
                            src="DirectMessage/freelancer1.png"
                            alt="profile2"
                            className="dmRgt-chat-profile-me"
                          ></img>
                        ) : (
                          <img
                            src="DirectMessage/enterprise1.png"
                            alt="profile2"
                            className="dmRgt-chat-profile-me"
                          ></img>
                        )}
                        <div className="dmRgt-chat-name-me">나</div>
                      </>
                    ) : null}
                    <div className="dmRgt-chat-arrow-me"></div>
                    <div className="dmcombine-me">
                      {i.img_code ? (
                        <img
                          className="dmRgt-chat-content-me"
                          src={"http://localhost:8080/upload/" + i.img_code}
                          alt="img"
                        ></img>
                      ) : i.file_code ? (
                        <div
                          className="dmRgt-chat-content-me-file"
                          onClick={() => {
                            download(i.file_code);
                          }}
                        >
                          <div className="dmfile-icon"></div> {i.file_code}
                        </div>
                      ) : (
                        <div className="dmRgt-chat-content-me">
                          {i.message_content}
                        </div>
                      )}

                      <div className="dmRgt-chat-time-me">{i.message_date}</div>
                    </div>
                  </>
                ) : (
                  <>
                    {index === 0 ||
                    i.user_id !== chatarraybox[index - 1].user_id ? (
                      <>
                        {userInfo.user_code === "free" ? (
                          <img
                            src="DirectMessage/freelancer1.png"
                            alt="profile2"
                            className="dmRgt-chat-profile"
                          ></img>
                        ) : (
                          <img
                            src="DirectMessage/enterprise1.png"
                            alt="profile2"
                            className="dmRgt-chat-profile"
                          ></img>
                        )}
                        <div className="dmRgt-chat-name">{chatRname}</div>
                      </>
                    ) : null}
                    <div className="dmRgt-chat-arrow"></div>
                    <div className="dmcombine">
                      {i.img_code ? (
                        <img
                          className="dmRgt-chat-content"
                          src={"http://localhost:8080/upload/" + i.img_code}
                          alt="img"
                        ></img>
                      ) : i.file_code ? (
                        <div
                          className="dmRgt-chat-content-file"
                          onClick={() => {
                            download(i.file_code);
                          }}
                        >
                          <div className="dmfile-icon"></div>
                          {i.file_code}
                        </div>
                      ) : (
                        <div className="dmRgt-chat-content">
                          {i.message_content}
                        </div>
                      )}

                      <div className="dmRgt-chat-time">{i.message_date}</div>
                    </div>
                  </>
                )}
              </>
            );
          })
        )}

        {chatArray.map(function (i, index) {
          // 웹소켓 통신을 채팅창에 표시하는 부분
          return (
            <>
              {i.msgContent === "" ? (
                <div className="dmquitalarm">
                  {i.msgId}님이 채팅방을 나갔습니다.
                </div>
              ) : i.msgId === login_id ? (
                <>
                  {index === 0 || i.msgId !== chatArray[index - 1].msgId ? (
                    <>
                      <img
                        src="DirectMessage/freelancer1.png"
                        alt="profile2"
                        className="dmRgt-chat-profile-me"
                      ></img>
                      <div className="dmRgt-chat-name-me">나</div>
                    </>
                  ) : null}
                  <div className="dmRgt-chat-arrow-me"></div>
                  <div className="dmcombine-me">
                    {i.img_code ? (
                      <img
                        className="dmRgt-chat-content-me"
                        src={"http://localhost:8080/upload/" + i.img_code}
                        alt="img"
                      ></img>
                    ) : i.file_code ? (
                      <div
                        className="dmRgt-chat-content-me-file"
                        onClick={() => {
                          download(i.file_code);
                        }}
                      >
                        <div className="dmfile-icon"></div> {i.file_code}
                      </div>
                    ) : (
                      <div className="dmRgt-chat-content-me">
                        {i.msgContent}
                      </div>
                    )}

                    <div className="dmRgt-chat-time-me">{i.msgDate}</div>
                  </div>
                </>
              ) : (
                <>
                  {index === 0 || i.msgId !== chatArray[index - 1].msgId ? (
                    <>
                      <img
                        src="DirectMessage/freelancer1.png"
                        alt="profile2"
                        className="dmRgt-chat-profile"
                      ></img>
                      <div className="dmRgt-chat-name">{chatRname}</div>
                    </>
                  ) : null}
                  <div className="dmRgt-chat-arrow"></div>
                  <div className="dmcombine">
                    {i.img_code ? (
                      <img
                        className="dmRgt-chat-content"
                        src={"http://localhost:8080/upload/" + i.img_code}
                        style={{ objectFit: "cover" }}
                        alt="img"
                      ></img>
                    ) : i.file_code ? (
                      <div
                        className="dmRgt-chat-content-file"
                        onClick={() => {
                          download(i.file_code);
                        }}
                      >
                        <div className="dmfile-icon"></div> {i.file_code}
                      </div>
                    ) : (
                      <div className="dmRgt-chat-content">{i.msgContent}</div>
                    )}

                    <div className="dmRgt-chat-time">{i.msgDate}</div>
                  </div>
                </>
              )}
            </>
          );
        })}
      </div>

      <div className="dmRgt-div-input">
        {chatname === "(알 수 없음)" ? (
          <div className="dminput-something-no"></div>
        ) : (
          <div
            className="dminput-something"
            onClick={() => {
              if (채팅방num === 0) {
              } else {
                setAttach(!attach);
              }
            }}
          ></div>
        )}
        {attach === true ? (
          <>
            <div className="dmattach-pic" onClick={onClickImageInput}>
              <input
                type="file"
                style={{ display: "none" }}
                accept="image/*"
                ref={imageInput}
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const fileName = file.name;
                    setImgFile(file);
                    setImgFileName(fileName);
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onloadend = () => {
                      setImageFile(reader.result);
                    };
                  }
                }}
              ></input>
            </div>
            {imgFile && (
              <>
                <div className="dmImageBox">
                  {imgFile && (
                    <img
                      src={imgFile ? imageFile : null}
                      className="dmthumbImg"
                      alt="미리보기"
                    ></img>
                  )}
                </div>
                <div
                  className="dmImageAccept"
                  onClick={() => {
                    if (imgFile) {
                      const currentDate = +new Date();
                      stompClient.send(
                        "/pub/message",
                        {},
                        JSON.stringify({
                          chatroom_id: 채팅방num,
                          user_id: login_id,
                          message_content: "사진",
                          message_date: currentDate,
                          img_code: imgFileName,
                          file_code: null,
                        })
                      );
                      const formData = new FormData();
                      formData.append("file", imgFile);
                      const config = {
                        headers: { "Content-Type": "multipart/form-data" },
                      };
                      axios
                        .post(
                          "http://localhost:8080/file-upload",
                          formData,
                          config
                        )
                        .then((res) => {
                          //console.log("업로드 완료");
                          setAttach(!attach);
                        })
                        .catch((error) => {
                          console.error("/file-upload axios 에러 발생" + error);
                        });
                    }
                    setImgFile(null);
                    setImgFileName(null);
                  }}
                />
                <div
                  className="dmImageDeny"
                  onClick={() => {
                    setImageFile(null);
                    setImgFile(null);
                    setImgFileName(null);
                  }}
                />
              </>
            )}

            <div className="dmattach-file" onClick={onClickFileInput}>
              <input
                type="file"
                style={{ display: "none" }}
                accept="*"
                ref={fileInput}
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const fileName = file.name;
                    setFileName(fileName);
                    setDmFile(file);
                  }
                }}
              ></input>
            </div>
            {dmfile && (
              <>
                <div className="dmImageBox">
                  {dmfile && <div className="dmattach-textbox">{filename}</div>}
                </div>
                <div
                  className="dmImageAccept"
                  onClick={() => {
                    if (dmfile) {
                      const currentDate = +new Date();
                      stompClient.send(
                        "/pub/message",
                        {},
                        JSON.stringify({
                          chatroom_id: 채팅방num,
                          user_id: login_id,
                          message_content: "첨부파일",
                          message_date: currentDate,
                          img_code: null,
                          file_code: filename,
                        })
                      );
                      const formData = new FormData();
                      formData.append("file", dmfile);
                      const config = {
                        headers: { "Content-Type": "multipart/form-data" },
                      };
                      axios
                        .post(
                          "http://localhost:8080/file-upload",
                          formData,
                          config
                        )
                        .then((res) => {
                          //console.log("업로드 완료");
                          setAttach(!attach);
                        })
                        .catch((error) => {
                          console.error("/file-upload axios 에러 발생" + error);
                        });
                    }
                    setDmFile(null);
                  }}
                />
                <div
                  className="dmImageDeny"
                  onClick={() => {
                    setDmFile(null);
                  }}
                />
              </>
            )}
          </>
        ) : null}
        {chatname === "(알 수 없음)" ? (
          <div className="dminput-text" style={{ color: "gray" }}>
            대화 상대가 없습니다
          </div>
        ) : (
          <input
            type="text"
            className="dminput-text"
            placeholder="메시지를 입력하세요"
            value={inputchat}
            onFocus={chatfocus}
            onBlur={chatblur}
            onChange={inputchatvalue}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                // 엔터키를 눌러도 보내기 버튼을 누르는 것과 같음
                if (inputchat === "") {
                  alert("메시지를 입력하세요");
                } else {
                  send();
                }
              }
            }}
          ></input>
        )}
        {chatname === "(알 수 없음)" ? (
          <div className="dminput-button-no">보내기</div>
        ) : (
          <div
            className="dminput-button"
            onClick={() => {
              if (채팅방num === 0) {
              } else {
                if (inputchat === "") {
                  alert("메시지를 입력하세요");
                } else {
                  send();
                }
              }
            }}
          >
            보내기
          </div>
        )}
        <div className="dminput-line"></div>
      </div>
    </div>
  );
}

export default DirectMessage;
