import React, { useState } from "react";
import DatePicker from "react-datepicker";
import { ko } from "date-fns/esm/locale";

import "react-datepicker/dist/react-datepicker.css";

const DatePick = ({ startDate, setStartDate }) => {
  // const [test, setTest] = useState(new Date());
  console.log(startDate);
  return (
    <DatePicker
      locale={ko}
      dateFormat="yyyy-MM-dd"
      closeOnScroll={true}
      selected={startDate}
      minDate={new Date()}
      onChange={(date) => setStartDate(date)}
    />
  );
};

export default DatePick;
