import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/login/LoginScreen.css"

const Signup = () => {
  const [formData, setFormData] = useState({
    userEmail: "",
    userPwd: "",
    userPwdCheck: ""
  })

  const [message, setMessage] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // 화면이동 함수
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault();
    // 서버 요청 또는 로직 추가
    if(!formData.userEmail){
      setMessage("이메일을 입력해주세요.");
    } else if(!formData.userPwd){
      setMessage("비밀번호를 입력해주세요.");
    } else if(formData.userPwd !== formData.userPwdCheck){
      setMessage("비밀번호가 일치하지 않습니다.")
    } else{
      // 회원가입 정보를 localStorage에 저장
      const newUser = {
        username: formData.userEmail,
        password: formData.userPwd,
      };
      localStorage.setItem("user", JSON.stringify(newUser));

      alert("회원가입 완료")
      navigate("/login")
    }
  };

  return (
    <div className="signup-container">
      <h2>회원가입</h2>
      <form onSubmit={handleSubmit}>
        {/* <label htmlFor="nickname">닉네임</label> */}
        {/* <input
          type="text"
          id="nickname"
          value={formData.nickname}
          onChange={handleChange}
          placeholder="닉네임을 입력하세요"
          required
        /> */}

        <label htmlFor="userEmail">이메일(ID)</label>
        <input
          type="text"
          id="userEmail"
          name="userEmail"
          value={formData.userEmail}
          onChange={handleChange}
          placeholder="이메일을 입력하세요"
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

        <button type="submit">회원가입</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Signup;
