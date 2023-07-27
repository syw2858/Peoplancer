import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";

const Registerform_1 = () => {
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [isMatch, setIsMatch] = useState(false);
  const idRef = useRef();
  const pwRef = useRef();
  const pwConfirmRef = useRef();
  const nmRef = useRef();
  const bthRef = useRef();
  const emailRef = useRef();
  const phRef = useRef();
  const [phoneNumber, setPhoneNumber] = useState("");
  const navigate = useNavigate();
  const [fileList, setFileList] = useState([]);
  const [isIdExist, setIsIdExist] = useState(false);
  const handleCheck = () => {
    if (idRef.current.value === "") {
      alert("아이디를 입력해주세요!!!");
      return false;
    }
    axios
      .get(
        `http://localhost:8080/user/checkMember?user_id=${idRef.current.value}`
      )
      .then((res) => {
        setIsIdExist(res.data); //
        if (res.data) {
          alert("중복된 아이디입니다.");
        } else {
          alert("사용 가능한 아이디입니다.");
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const getNewLicense = (e) => {
    const uploadFiles = Array.prototype.slice.call(e.target.files);
    uploadFiles.forEach((uploadFile) => {
      setFileList(uploadFile);
    });
  };
  const handleIdKeyPress = (event) => {
    const charCode = event.which ? event.which : event.keyCode;
    if (
      charCode === 33 ||
      charCode === 35 ||
      charCode === 36 ||
      charCode === 37 ||
      charCode === 38 ||
      charCode === 42 ||
      charCode === 43 ||
      charCode === 64
    ) {
      event.preventDefault();
    }
  };

  const handlePasswordChange = (event) => {
    const inputValue = event.target.value;
    setPassword(inputValue);

    if (password === inputValue && inputValue !== null && inputValue !== '') {
      setIsMatch(true);
    } else {
      setIsMatch(false);
    }

    const regex =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+=-]).{8,16}$/;
    const isValidPassword = regex.test(password);

    if (isValidPassword) {
      // 비밀번호 유효성 검사 통과
    } else {
      // 비밀번호 유효성 검사 실패
    }
  };

  const handlePhoneNumberChange = (event) => {
    const inputPhoneNumber = event.target.value;

    // 11자리 전화번호를 다 입력하지 않은 경우, 입력만 받고 검사를 하지 않습니다.
    if (inputPhoneNumber.length < 11) {
      setPhoneNumber(inputPhoneNumber);
    }
    // 11자리 전화번호를 다 입력한 경우, 검사 수행
    else if (inputPhoneNumber.length === 11) {
      const regex = /^[0-9]{10,11}$/;
      if (!regex.test(inputPhoneNumber)) {
        alert("전화번호는 10자리 또는 11자리의 숫자로만 입력해주세요.");
        return;
      }

      const regex2 = /^[0-9]*$/;
      if (!regex2.test(inputPhoneNumber)) {
        alert("전화번호는 숫자로만 입력해주세요.");
        return;
      }
      const phoneNumberPattern = /^(01[0|1|6|7|8|9])(\d{3,4})(\d{4})$/;
      if (!phoneNumberPattern.test(inputPhoneNumber)) {
        alert("전화번호를 다시 입력해주세요. (예: 01012345678)");
        return;
      }

      // 전화번호 저장
      setPhoneNumber(inputPhoneNumber);
    }
  };

  const handlePasswordConfirmChange = (event) => {
    setPasswordConfirm(event.target.value);
    if (password === event.target.value && event.target.value !== null && event.target.value !== '') {
      setIsMatch(true);
    } else {
      setIsMatch(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (password === passwordConfirm) {
      console.log("비밀번호 일치");
    } else {
      console.log("비밀번호 불일치");
    }
  };
  const handleMember = () => {
    if (idRef.current.value === "" || idRef.current.value === undefined) {
      alert("이이디를 입력하세요!");
      idRef.current.focus();
      return false;
    }
    if (isIdExist) {
      alert("이미 존재하는 아이디입니다!");
      idRef.current.focus();
      return false;
    }

    if (pwRef.current.value === "" || pwRef.current.value === undefined) {
      alert("패스워드를 입력하세요!");
      pwRef.current.focus();
      return false;
    }

    if (nmRef.current.value === "" || nmRef.current.value === undefined) {
      alert("상호 명을 입력하세요!");
      nmRef.current.focus();
      return false;
    }
    if (fileList.length === 0) {
      alert("라이센스를 등록하세요!");
      return false;
    }
    if (emailRef.current.value === "" || emailRef.current.value === undefined) {
      alert("이메일을 입력하세요!");
      emailRef.current.focus();
      return false;
    }
    if (phRef.current.value === "" || phRef.current.value === undefined) {
      alert("이메일을 입력하세요!");
      phRef.current.focus();
      return false;
    }
    const formData = new FormData();
    formData.append("uploadfiles", fileList);
    axios
      .post("http://localhost:8080/resume/upload", formData)
      .then((res) => {
        axios
          .post("http://localhost:8080/user/Registerform_1", {
            user_id: idRef.current.value,
            user_pw: pwRef.current.value,
            user_name: nmRef.current.value,
            user_email: emailRef.current.value,
            user_tel: phRef.current.value,
            user_code: "client",
            user_orlicense: res.data[0].originfilename,
            user_stlicense: res.data[0].storedfilename,
          })
          .then((res) => {
            console.log("insertUser =>", res);
            console.log("insertUser((res.data) =>", res.data);
            if (res.data === 1) {
              alert("회원가입 성공!");
              navigate("/Loginform");
            } else {
              alert("회원가입 실패!");
              navigate("/");
            }
          })
          .catch((e) => {
            console.error(e);
          });
      })
      .catch((e) => {
        console.error(e);
      });
  };

  return (
    <div>
      <center>
        <h1>클라이언트 회원가입</h1>
        <form onSubmit={handleSubmit}>
          <table border="0" width="300px" align="center">
            <hr />
            <tr>
              <td style={{ fontSize: "20px", paddingTop: "15px" }}>
                아이디
                <span style={{ color: "red", marginLeft: "5px" }}>*</span>
              </td>
            </tr>
            <tr>
              <td align="left" colspan="2">
                <input
                  type="text"
                  name="id"
                  size="40"
                  ref={idRef}
                  maxLength="12"
                  placeholder="아이디를 입력하세요(최대 12자)"
                  style={{ fontSize: "20px" }}
                  onKeyPress={handleIdKeyPress}
                />
                <button
                  type="button"
                  style={{
                    width: "100px",
                    height: "40px",
                    backgroundColor: "#ffe68b",
                    fontSize: "18px",
                    border: "none",
                    marginBottom: "25px",
                    marginLeft: "10px"
                  }}
                  onClick={handleCheck}
                >
                  중복확인
                </button>
              </td>
            </tr>

            <tr>
              <td style={{ fontSize: "20px" }}>
                비밀번호
                <span style={{ color: "red", marginLeft: "5px" }}>*</span>
              </td>
            </tr>
            <tr>
              <td align="left" colspan="2">
                <input
                  type="password"
                  name="password"
                  size="40"
                  minLength="8"
                  maxLength="16"
                  ref={pwRef}
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="비밀번호를 입력하세요(8~16자리, 특수문자 가능)"
                  style={{ fontSize: "20px", border: '1px solid black', marginBottom: "25px", }}
                />
              </td>
            </tr>

            <tr>
              <td style={{ fontSize: "20px" }}>
                비밀번호 확인
                <span style={{ color: "red", marginLeft: "5px" }}>*</span>
              </td>
            </tr>
            <tr>
              <td align="left" colspan="2">
                <input
                  type="password"
                  name="password-confirm"
                  size="40"
                  ref={pwConfirmRef}
                  value={passwordConfirm}
                  onChange={handlePasswordConfirmChange}
                  placeholder="비밀번호를 다시 입력하세요"
                  style={{ fontSize: "20px", border: '1px solid black' }}
                />
              </td>
            </tr>
            <tr>
              <td
                style={{ fontSize: "15px", color: isMatch ? "green" : "red", paddingBottom: "15px" }}
              >
                {isMatch
                  ? "비밀번호가 일치합니다."
                  : "비밀번호를 다시 확인해 주세요."}
              </td>
            </tr>

            <tr>
              <td style={{ fontSize: "20px" }}>
                상호 명
                <span style={{ color: "red", marginLeft: "5px" }}>*</span>
              </td>
            </tr>
            <tr>
              <td align="left" colspan="2">
                <input
                  type="text"
                  name="company"
                  size="40"
                  ref={nmRef}
                  placeholder="상호 명을 입력하세요"
                  style={{ fontSize: "20px", marginBottom: "25px" }}
                />
              </td>
            </tr>

            <tr>
              <td style={{ fontSize: "20px" }}>
                라이센스 파일을 업로드해주세요.
                <span style={{ color: "red", marginLeft: "5px" }}>*</span>
              </td>
            </tr>
            <tr>
              <td align="left" colspan="2">
                <input
                  type="file"
                  accept="image/*, .pdf"
                  onChange={getNewLicense}
                  style={{ fontSize: "20px", marginBottom: "25px" }}
                />
              </td>
            </tr>

            <tr>
              <td style={{ fontSize: "20px" }}>
                이메일
                <span style={{ color: "red", marginLeft: "5px" }}>*</span>
              </td>
            </tr>
            <tr>
              <td align="left" colspan="2">
                <input
                  type="text"
                  name="email"
                  size="40"
                  ref={emailRef}
                  placeholder="ex) email@peoplancer.com"
                  style={{ fontSize: "20px", marginBottom: "25px" }}
                />
              </td>
            </tr>

            <tr>
              <td style={{ fontSize: "20px" }}>
                <label htmlFor="phone-number-input">전화번호 </label>
                <span style={{ color: "red", marginLeft: "5px" }}>*</span>
              </td>
            </tr>
            <tr>
              <td align="left" colspan="2">
                <input
                  type="text"
                  id="phone-number-input"
                  name="phoneNumber"
                  ref={phRef}
                  value={phoneNumber}
                  onChange={handlePhoneNumberChange}
                  size="40"
                  placeholder="-빼고 숫자만 입력해주세요"
                  style={{ fontSize: "20px", marginBottom: "25px" }}
                />
              </td>
            </tr>

            <tr>
              <td align="left" colspan="2" style={{ fontSize: "15px" }}>
                <label style={{ display: "inline-block" }}>
                  <input
                    type="checkbox"
                    name="agreement"
                    value="agree"
                    required
                    style={{ width: "20px", height: "20px" }}
                  />
                  &nbsp; 서비스 이용약관에 동의합니다.
                  <span style={{ color: "red", marginLeft: "5px" }}>
                    (필수)
                  </span>
                </label>
              </td>
            </tr>
            <tr>
              <td align="left" colspan="2" style={{ fontSize: "15px" }}>
                <label style={{ display: "inline-block" }}>
                  <input
                    type="checkbox"
                    name="agreement"
                    value="agree"
                    required
                    style={{ width: "20px", height: "20px" }}
                  />
                  &nbsp; 개인정보 수집・이용에 동의합니다.
                  <span style={{ color: "red", marginLeft: "5px" }}>
                    (필수)
                  </span>
                </label>
              </td>
            </tr>
            <tr>
              <td align="left" colspan="2" style={{ fontSize: "15px" }}>
                <label style={{ display: "inline-block" }}>
                  <input
                    type="checkbox"
                    name="agreement"
                    value="agree"
                    style={{ width: "20px", height: "20px", marginBottom: "25px" }}
                  />
                  &nbsp; 마케팅 수신・홍보 목적의 개인정보 수집 및 이용에
                  동의합니다. (선택)
                </label>
              </td>
            </tr>

            <tr>
              <td colSpan="2" align="center" style={{ fontSize: "20px" }}>
                <button
                  onClick={handleMember}
                  style={{
                    width: "300px",
                    height: "60px",
                    backgroundColor: "#ffe68b",
                    border: "none",
                    marginBottom: "25px"
                  }}
                ><h1>회원가입</h1></button>
              </td>
            </tr>

            <hr />

            <tr>
              <td colSpan="2" align="center">
                <h4>
                  이미 Peoplancer 회원님이신가요? &nbsp;
                  <Link to="/Loginform" style={{ color: 'blue' }}>로그인하기</Link>
                </h4>
              </td>
            </tr>
          </table>
        </form>
      </center>
    </div >
  );
};

export default Registerform_1;
