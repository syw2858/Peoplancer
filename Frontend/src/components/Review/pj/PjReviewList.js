import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import "../../../css/Review.css";
import { AiFillStar } from "react-icons/ai";
import { AiOutlineStar } from "react-icons/ai";
import PjReviewUpdate from "./PjReviewUpdate";

const PjReviewList = ({ review, pj_num }) => {
  const navigate = useNavigate();
  const [isDeleted, setIsDeleted] = useState(false);
  const [showUpdate, setShowUpdate] = useState({});
  const user_id = window.sessionStorage.getItem("user_id");

  const handleDelete = (pj_rv_num) => {
    axios
      .get(`http://localhost:8080/pjreview/delete?pj_rv_num=${pj_rv_num}`, {})
      .then((res) => {
        alert("리뷰가 삭제되었습니다.");
        setIsDeleted(true);
      })
      .catch((e) => {
        alert("리뷰 삭제에 실패했습니다.");
        console.error(e);
      });
  };

  useEffect(() => {
    if (isDeleted) {
      window.location.reload(); // 페이지 새로고침
      setIsDeleted(false);
    }
  }, [isDeleted]);

  const toggleUpdate = (pj_rv_num) => {
    setShowUpdate((prevState) => ({
      ...prevState,
      [pj_rv_num]: !prevState[pj_rv_num],
    }));
  };

  return (
    <div>
      {Object.keys(review).length === 0 || review === undefined ? (
        <div>
          <div className="RvNull" align="center">
            리뷰가 존재하지 않습니다.
          </div>
        </div>
      ) : (
        <div className="RvList">
          {review.map((data) => (
            <div className="RvTable" key={data.pj_rv_num}>
              <hr />
              {showUpdate[data.pj_rv_num] ? (
                <PjReviewUpdate
                  pj_rv_num={data.pj_rv_num}
                  pj_num={pj_num}
                  review={data}
                />
              ) : (
                <table>
                  <tr>
                    <td colSpan={2} width="450px">
                      {data.pj_rv_score === 5 ? (
                        <div>
                          <AiFillStar />
                          <AiFillStar />
                          <AiFillStar />
                          <AiFillStar />
                          <AiFillStar />
                          &nbsp;{data.pj_rv_score}
                        </div>
                      ) : data.pj_rv_score === 4 ? (
                        <div>
                          <AiFillStar />
                          <AiFillStar />
                          <AiFillStar />
                          <AiFillStar />
                          <AiOutlineStar />
                          &nbsp;{data.pj_rv_score}
                        </div>
                      ) : data.pj_rv_score === 3 ? (
                        <div>
                          <AiFillStar />
                          <AiFillStar />
                          <AiFillStar />
                          <AiOutlineStar />
                          <AiOutlineStar />
                          &nbsp;{data.pj_rv_score}
                        </div>
                      ) : data.pj_rv_score === 2 ? (
                        <div>
                          <AiFillStar />
                          <AiFillStar />
                          <AiOutlineStar />
                          <AiOutlineStar />
                          <AiOutlineStar />
                          &nbsp;{data.pj_rv_score}
                        </div>
                      ) : (
                        <div>
                          <AiFillStar />
                          <AiOutlineStar />
                          <AiOutlineStar />
                          <AiOutlineStar />
                          <AiOutlineStar />
                          &nbsp;{data.pj_rv_score}
                        </div>
                      )}
                    </td>
                    <td align="right">
                      <button
                        className="RvBtn4"
                        onClick={() => {
                          if (user_id === data.user_id) {
                            toggleUpdate(data.pj_rv_num);
                          } else {
                            alert("리뷰 수정 권한이 없습니다.");
                          }
                        }}
                      >
                        수정
                      </button>
                      &nbsp;
                      <button
                        className="RvBtn4"
                        onClick={() => {
                          if (user_id === data.user_id) {
                            handleDelete(data.pj_rv_num);
                          } else {
                            alert("리뷰 삭제 권한이 없습니다.");
                          }
                        }}
                      >
                        삭제
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td
                      width="50px"
                      style={{ fontSize: "12px", color: "gray" }}
                    >
                      작성자
                    </td>
                    <td width="400px" style={{ fontSize: "12px" }}>
                      {data.user_id}
                    </td>
                    <td
                      align="right"
                      style={{ fontSize: "12px", color: "gray" }}
                    >
                      {data.pj_rv_date}
                    </td>
                  </tr>
                  <tr>
                    <td>&nbsp;</td>
                  </tr>
                  <tr>
                    <td colSpan={3}>{data.pj_rv_content}</td>
                  </tr>
                </table>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PjReviewList;
