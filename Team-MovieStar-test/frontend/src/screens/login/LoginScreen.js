import React, { useState, useContext } from "react"
import { AppContext } from "../../context/AppContext"
import { Link, useNavigate } from "react-router-dom"
import "../../css/login/LoginScreen.css"
import logo from "../../logo/logo.png"
import axios from "axios"

const LoginScreen = () => {
    const [formData, setFormData] = useState({ userName: "", userPwd: "" })
    const [error, setError] = useState("")
    const { setUser } = useContext(AppContext)
    const navigate = useNavigate()

  // const handleLogin = async () => {
  //   try {
  //       const response = await axios.post("/api/auth/login", {
  //           username,
  //           password,
  //       })
  //       alert(response.data.message)
  //   } catch (error) {
  //       alert("Login failed. Please check your credentials.")
  //   }
  // }

  // const handleSocialLogin = (provider) => {
  //   window.location.href = `/oauth2/authorization/${provider}`
  // }

  // 로고 클릭 시 메인화면 띄우기
  const handleLogoClick = () => {
    navigate("/home")
  }

  // 입력값 업데이트
  const handleChange = (e) => {
    const { id, value } = e.target
    setFormData({ ...formData, [id]: value })
  };

  // 폼 제출 처리
  const handleSubmit = (e) => {
    e.preventDefault()

    // localStorage에서 유저 정보 가져오기
    const storedUser = JSON.parse(
      localStorage.getItem(
        Object.keys(window.localStorage).find(
        key => JSON.parse(localStorage.getItem(key)).userName === formData.userName
      )))

    // 유저 정보 확인
    if (
      storedUser && 
      storedUser.userPwd=== formData.userPwd
    ) {
      // 로그인 성공 시
      setUser({ 
        userName: storedUser.userName,
        userEmail: storedUser.userEmail,
        userNick: storedUser.userNick,
        userLikeList: storedUser.userLikeList,
      }) // 사용자 정보를 Context에 저장
      navigate("/home"); // MainScreen으로 이동
    } else {
      // 에러 메시지 출력
      setError("아이디 또는 비밀번호가 일치하지 않습니다.");
    }
  };

  return (
    <div className="login-container">
      <div className="logo-box">
        <img src={logo} className="loginLogo" onClick={handleLogoClick}/>
      </div>
      <div className="login-box">
        <h2>로그인</h2>

        {/* 로그인 폼 */}
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="userName">아이디</label>
            <input
              type="text"
              id="userName"
              placeholder="아이디를 입력하세요"
              value={formData.userName}
              onChange={handleChange}
            />
          </div>
          <div className="input-group">
            <label htmlFor="userPwd">비밀번호</label>
            <input
              type="password"
              id="userPwd"
              placeholder="비밀번호를 입력하세요"
              value={formData.userPwd}
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="login-button">
            로그인
          </button>
        </form>

        {/* 에러 메시지 */}
        {error && <p className="error-message">{error}</p>}

        {/* 소셜 로그인 섹션 */}
        <div className="social-login-section">
          <p className="social-login-title">소셜 로그인</p>
          <div className="social-login">
            <button className="social-button naver">네이버 로그인</button>
            <button className="social-button kakao">카카오 로그인</button>
            <button className="social-button google">구글 로그인</button>
          </div>
        </div>

        {/* 링크 섹션 */}
        <div className="links">
          <Link to="/find-id">아이디 찾기</Link>
          <Link to="/find-password">비밀번호 찾기</Link>
          <Link to="/signup">회원가입</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
