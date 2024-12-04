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

  useEffect(() => {
    const emailCheck = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/ //이메일 식별 정규식

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

  // 화면이동 함수
  const navigate = useNavigate()

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
          placeholder="이메일을 입력하세요"
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
