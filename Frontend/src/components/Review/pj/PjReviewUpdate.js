import "../../../css/Review.css";
import axios from "axios";
import { useState, useRef, useEffect } from "react";

const PjReviewUpdate = ({ pj_rv_num, pj_num, review }) => {
  const [isUpdated, setIsUpdated] = useState(false);
  const scoreRef = useRef();
  const contentRef = useRef();
  const user_id = window.sessionStorage.getItem("user_id");

  const handleUpdate = () => {
    if (user_id !== review.user_id) {
      alert("리뷰 수정 권한이 없습니다.");
    } else {
      axios
        .post(`http://localhost:8080/pjreview/update`, {
          pj_rv_num: pj_rv_num,
          pj_rv_score: scoreRef.current.value,
          pj_rv_content: contentRef.current.value,
        })
        .then((res) => {
          const data = res.data;
          console.log("updated data: ", data);
          alert("리뷰가 수정되었습니다.");
          setIsUpdated(true);
        })
        .catch((e) => {
          console.error(e);
          alert("리뷰 수정에 실패했습니다.");
          setIsUpdated(true);
        });
    }
  };

  useEffect(() => {
    if (isUpdated) {
      window.location.reload(); // 페이지 새로고침
      setIsUpdated(false);
    }
  }, [isUpdated]);

  return (
    <div className="RvForm">
      <table>
        <tr>
          <td width="30px">평점</td>
          <td>
            <select ref={scoreRef} defaultValue={review.pj_rv_score}>
              <option value={5}>★★★★★ 5</option>
              <option value={4}>★★★★☆ 4</option>
              <option value={3}>★★★☆☆ 3</option>
              <option value={2}>★★☆☆☆ 2</option>
              <option value={1}>★☆☆☆☆ 1</option>
            </select>
          </td>
          <td width="30px" style={{ color: "#444" }} align="right">
            작성자&nbsp;&nbsp;&nbsp;{user_id}
          </td>
        </tr>
        <tr>
          <td colSpan={3}>
            <textarea
              cols="80"
              rows="10"
              ref={contentRef}
              defaultValue={review.pj_rv_content}
            ></textarea>
          </td>
        </tr>
        <tr>
          <td colSpan={3} align="center">
            <button className="RvBtn" onClick={() => handleUpdate()}>
              수정
            </button>
            &nbsp;
            <button
              className="RvBtn3"
              onClick={() => {
                alert("리뷰 수정이 취소되었습니다.");
                setIsUpdated(true);
              }}
            >
              취소
            </button>
          </td>
        </tr>
      </table>
    </div>
  );
};
export default PjReviewUpdate;
