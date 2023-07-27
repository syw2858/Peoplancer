import axios from "axios";
import { useState, useEffect } from "react";
import { AiFillStar } from "react-icons/ai";

const PjReviewAvg = ({ review, pj_num }) => {
  const [count, setCount] = useState();
  const [total, setTotal] = useState();
  const [average, setAverage] = useState(null); // 초기값을 null로 설정

  useEffect(() => {
    getAvg();
  }, [review]);

  const getAvg = async () => {
    try {
      const countResponse = await axios.get(
        `http://localhost:8080/pjreview/cnt?pj_num=${pj_num}`
      );
      const totalCount = countResponse.data;
      setCount(totalCount);

      const totalResponse = await axios.get(
        `http://localhost:8080/pjreview/tot?pj_num=${pj_num}`
      );
      const totalSum = totalResponse.data;
      setTotal(totalSum);

      if (totalCount === 0 || totalSum === 0) {
        setAverage(0);
      } else {
        setAverage(Math.round((totalSum / totalCount) * 10) / 10);
      }
    } catch (error) {
      console.log("리뷰 정보를 가져오지 못했습니다.");
      console.error(error);
    }
  };

  if (average === null) {
    return <div>&nbsp;</div>; // 로딩 상태를 표시
  }

  return (
    <div>
      <h3>
        <AiFillStar color="red" />
        &nbsp;{average.toFixed(1)}&nbsp; ({review.length})
      </h3>
    </div>
  );
};

export default PjReviewAvg;
