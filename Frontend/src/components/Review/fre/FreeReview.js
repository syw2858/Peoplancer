import axios from "axios";
import "../../../css/Review.css";
import { useState, useEffect } from "react";
import FreeReviewList from "./FreeReviewList";
import FreeReviewWrite from "./FreeReviewWrite";
import FreeReviewAvg from "./FreeReviewAvg";
import { useNavigate } from "react-router-dom";

const FreeReview = (props) => {
  const [review, setReview] = useState({});
  const [reviewForm, setReviewForm] = useState(false);
  const [usercode, setUsercode] = useState([]);
  const [isClientUser, setIsClientUser] = useState(false);
  const navigate = useNavigate();

  const fre_rv_target = props.fre_rv_target;
  const loginid = window.sessionStorage.getItem("user_id");
  console.log("props fre_rv_target: ", fre_rv_target);

  useEffect(() => {
    getReviewList();
    getUser();
  }, []);

  const getReviewList = () => {
    axios
      .get(
        `http://localhost:8080/frereview/list?fre_rv_target=${fre_rv_target}`,
        {}
      )
      .then((res) => {
        const data = res.data;
        setReview(data);
        console.log("getReviewList => ", data);
      })
      .catch((e) => {
        console.log("리뷰 목록을 가져오지 못했습니다.");
        console.error(e);
      });
  };

  const getUser = () => {
    axios
      .post(`http://localhost:8080/user/getuser`, { user_id: loginid })
      .then((res) => {
        const data = res.data;
        setUsercode(data);
        setIsClientUser(data.user_code === "client");
      })
      .catch((e) => {
        console.error(e);
      });
  };
  console.log("usercode data: ", usercode, usercode.user_id);
  console.log("usercode user_code: ", usercode.user_code);

  // usercode.user_code 값을 부모 컴포넌트로 전달
  useEffect(() => {
    props.onUsercodeChange(usercode.user_code);
  }, [usercode.user_code]);

  const toggleReviewForm = () => {
    if (isClientUser) {
      setReviewForm(!reviewForm);
    } else {
      if (usercode.user_code === "free") {
        alert("프리랜서 리뷰는 협업한 클라이언트만 작성 가능합니다.");
      } else if (loginid === null || loginid === "") {
        alert("로그인 후 이용 가능한 서비스입니다.");
        navigate("/loginform");
      }
    }
  };

  return (
    <div id={review.fre_rv_num} className="RvContainer">
      <div className="RvWrite">
        {usercode.user_code !== "free" && (
          <button className="RvBtn2" onClick={toggleReviewForm}>
            작성하기
          </button>
        )}
      </div>

      {reviewForm && <FreeReviewWrite fre_rv_target={fre_rv_target} />}

      <FreeReviewAvg review={review} fre_rv_target={fre_rv_target} />
      <FreeReviewList review={review} fre_rv_target={fre_rv_target} />
    </div>
  );
};
export default FreeReview;
