import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../css/Resume.css";

const InputWon = (data) => {
  const [value, setValue] = useState("");
  useEffect(() => {
    let val = data.pay;
    data.onData(data.pay);
    if (val !== "") {
      val = val + "만원";
    }

    setValue(val);
  }, []);
  function handleInputChange(event) {
    const strVal = event.target.value;
    let keyID = event.which || event.keyCode;
    if (
      (keyID >= 48 && keyID <= 57) ||
      (keyID >= 96 && keyID <= 105) ||
      keyID === 46 ||
      keyID === 8 ||
      keyID === 109 ||
      keyID === 189 ||
      keyID === 9 ||
      keyID === 37 ||
      keyID === 39
    ) {
      if (strVal.length > 1 && (keyID === 109 || keyID === 189)) {
        return false;
      } else {
        return;
      }
    } else {
      return false;
    }
  }

  function handleInputBlur() {
    let val = value;
    val = val.replace(",", "");
    val = val.replace(/[^-\.0-9]/gi, "");
    if (val !== "") {
      if (val.charAt(0) === "0" && val.length > 1) {
        val = val.substr(1);
      }
      data.onData(val);
    }
    val = val.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
    if (val !== "") {
      val = val + "만원";
    }
    setValue(val);
  }

  function handleInputFocus() {
    let val = value;
    val = val.replace(/[^-\.0-9]/gi, "");
    val = val.replace("만원", "");
    setValue(val);
  }

  function handleValueChange(event) {
    let val = event.target.value;
    val = val.replace(/[^-\.0-9]/gi, "");

    setValue(val);
  }

  return (
    <div className="resume_input">
      <input
        type="text"
        id="user_pay"
        name="user_pay"
        maxLength={4}
        value={value}
        placeholder="0만원"
        onChange={handleValueChange}
        onBlur={handleInputBlur}
        onFocus={handleInputFocus}
        onKeyDown={handleInputChange}
        className="box_input"
      />
    </div>
  );
};

export default InputWon;
