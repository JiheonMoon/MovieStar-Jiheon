import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/login/LoginScreen.css"

const Signup = () => {
  const [formData, setFormData] = useState({
    userEmail: "",
    userPwd: "",
    userPwdCheck: "",
    userNick: "",
    userName: "",
    userLikeList: [],
  })

  const [message, setMessage] = useState("")

  const [disabled, setDisabled] = useState(true)

  // 화면이동 함수
  const navigate = useNavigate()

  useEffect(() => {
    // 이메일 식별 정규식
    const emailCheck = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/
    
    // 비밀번호 정규식
    const passwordCheck = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    
    // 서버 요청 또는 로직 추가
    if (!formData.userName) {
      setMessage("아이디를 입력해주세요")
      setDisabled(true)
    } else if (!formData.userEmail) {
      setMessage("이메일을 입력해주세요.");
      setDisabled(true)
    } else if (!emailCheck.test(formData.userEmail)) {
      setMessage("이메일 형식을 확인해주세요.");
      setDisabled(true)
    } else if (!formData.userNick) {
      setMessage("닉네임을 입력해주세요.");
      setDisabled(true)
    } else if (!formData.userPwd) {
      setMessage("비밀번호를 입력해주세요.");
      setDisabled(true)
    } else if(!passwordCheck.test(formData.userPwd)) {
      setMessage("비밀번호는 최소 8자이며 대문자, 소문자, 숫자, 특수문자를 포함해야 합니다.")
      setDisabled(true)
    } else if (formData.userPwd !== formData.userPwdCheck) {
      setMessage("비밀번호가 일치하지 않습니다.")
      setDisabled(true)
    } else{
      setMessage("")
      setDisabled(false)
    }
  }, [formData])

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!disabled) {
      // 회원가입 정보를 localStorage에 저장
      const newUser = {
        userName: formData.userName,
        userPwd: formData.userPwd,
        userEmail: formData.userEmail,
        userNick: formData.userNick,
        userLikeList: [],
      };
      localStorage.setItem(localStorage.length + 1, JSON.stringify(newUser));

      alert("회원가입 완료")
      navigate("/login")

      // 서버로 회원가입 요청(백엔드 연결 시 위 코드 다음과 같이 수정)
    //   const response = await fetch("/api/signup", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify(formData),
    //   });

    //   if (response.ok) {
    //     alert("회원가입 완료");
    //     navigate("/login");
    //   } else {
    //     setMessage("회원가입 중 오류가 발생했습니다.");
    //   }
    // }
    }
  };

  return (
    <div className="signup-container">
      <h2>회원가입</h2>



      <form onSubmit={handleSubmit}>
        <label htmlFor="userName">아이디</label>
        <input
          type="text"
          id="userName"
          name="userName"
          value={formData.userName}
          onChange={handleChange}
          placeholder="아이디를 입력하세요"
          required
        />


        <label htmlFor="userEmail">이메일</label>
        <input
          type="text"
          id="userEmail"
          name="userEmail"
          value={formData.userEmail}
          onChange={handleChange}
          placeholder="이메일을 입력하세요"
          required
        />

        <label htmlFor="userNick">닉네임</label>
        <input
          type="text"
          id="userNick"
          name="userNick"
          value={formData.userNick}
          onChange={handleChange}
          placeholder="닉네임을 입력하세요"
          required
        />

        <label htmlFor="userPwd">비밀번호</label>
        <input
          type="password"
          id="userPwd"
          name="userPwd"
          value={formData.userPwd}
          onChange={handleChange}
          placeholder="비밀번호를 입력하세요"
          required
        />

        <label htmlFor="userPwdCheck">비밀번호 확인</label>
        <input
          type="password"
          id="userPwdCheck"
          name="userPwdCheck"
          value={formData.userPwdCheck}
          onChange={handleChange}
          placeholder="비밀번호를 다시 입력하세요"
          required
        />

        <button type="submit" disabled={disabled}>회원가입</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Signup;
