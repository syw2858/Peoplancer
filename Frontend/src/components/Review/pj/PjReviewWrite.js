import "../../../css/Review.css";
import { useNavigate } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import axios from "axios";

const PjReviewWrite = (props) => {
  const navigate = useNavigate();
  const [isWritten, setIsWritten] = useState(false);
  const [info, setInfo] = useState({
    pj_rv_score: "",
    pj_rv_content: "",
    user_id: "",
    pj_num: "",
  });

  useEffect(() => {
    setInfo((prevInfo) => ({
      ...prevInfo,
      user_id: window.sessionStorage.getItem("user_id"),
      pj_num: props.pj_num,
    }));
  }, [props.pj_num]);
  const scoreRef = useRef();
  const contentRef = useRef();

  const handleRvWrite = () => {
    if (scoreRef.current.value === "" || scoreRef.current.value === undefined) {
      alert("평점을 입력하세요.");
      scoreRef.current.focus();
      return false;
    }
    if (
      contentRef.current.value === "" ||
      contentRef.current.value === undefined
    ) {
      alert("내용을 입력하세요.");
      contentRef.current.focus();
      return false;
    }

    axios
      .post("http://localhost:8080/pjreview/insert", info)
      .then((res) => {
        const data = res.data;
        console.log(data);
        alert("리뷰가 등록되었습니다.");
        setIsWritten(true);
      })
      .catch((e) => {
        console.error(e);
        alert("리뷰 등록에 실패했습니다.");
        console.log(info);
      });
  };

  useEffect(() => {
    if (isWritten) {
      window.location.reload(); // 페이지 새로고침
      setIsWritten(false);
    }
  }, [isWritten]);

  return (
    <div className="RvForm">
      <table>
        <tr>
          <td width="30px">평점</td>
          <td>
            <select
              ref={scoreRef}
              onChange={() =>
                setInfo((prevInfo) => ({
                  ...prevInfo,
                  pj_rv_score: scoreRef.current.value,
                }))
              }
            >
              <option value={5}>★★★★★ 5</option>
              <option value={4}>★★★★☆ 4</option>
              <option value={3}>★★★☆☆ 3</option>
              <option value={2}>★★☆☆☆ 2</option>
              <option value={1}>★☆☆☆☆ 1</option>
            </select>
          </td>
        </tr>
        <tr>
          <td colSpan={2}>
            <textarea
              placeholder="협업 과정은 어떠셨나요? 프로젝트의 리뷰를 남겨주세요!"
              ref={contentRef}
              cols="80"
              rows="10"
              onChange={() =>
                setInfo((prevInfo) => ({
                  ...prevInfo,
                  pj_rv_content: contentRef.current.value,
                }))
              }
            ></textarea>
          </td>
        </tr>
        <tr>
          <td align="center" colSpan={2}>
            <button className="RvBtn" onClick={handleRvWrite}>
              등록
            </button>
            &nbsp;
            <button
              className="RvBtn3"
              onClick={() => {
                alert("리뷰 등록이 취소되었습니다.");
                setIsWritten(true);
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

export default PjReviewWrite;
