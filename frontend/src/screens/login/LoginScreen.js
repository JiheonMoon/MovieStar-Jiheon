import React, { useState, useContext, useEffect } from "react"
import { AppContext } from "../../context/AppContext"
import { API_BASE_URL } from "../../api/api-config"
import { Link, useNavigate } from "react-router-dom"
import "../../css/login/LoginScreen.css"
import logo from "../../logo/logo.png"
import axios from "axios"

const LoginScreen = () => {
    const [formData, setFormData] = useState({ userName: "", userPwd: "" })
    const [error, setError] = useState("")
    const { setUser } = useContext(AppContext)
    const navigate = useNavigate()

  // 로고 클릭 시 메인화면 띄우기
  const handleLogoClick = () => {
    navigate("/home")
  }

  // 네이버 로그인
  const handleNaverLogin = () => {
    const NAVER_CLIENT_ID = process.env.REACT_APP_NAVER_LOGIN_CLIENT_ID; // 클라이언트 ID
        const REDIRECT_URI = 'https://moviestar-moon.site/login/naver'; // Redirect URI
        const STATE = "someRandomState"; // CSRF 방지를 위한 state 값
    
        if (!NAVER_CLIENT_ID) {
            console.error("NAVER_CLIENT_ID가 설정되지 않았습니다.");
            alert("네이버 로그인 설정 오류! 클라이언트 ID를 확인해주세요.");
            return;
        }
    
        const NAVER_AUTH_URL = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${NAVER_CLIENT_ID}&state=${STATE}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;
        window.location.href = NAVER_AUTH_URL;
  }

  // 구글 로그인
  const handleGoogleLogin = () => {
    const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_LOGIN_CLIENT_ID; // 클라이언트 ID
    const REDIRECT_URI = 'https://moviestar-moon.site/login/google'; // Redirect URI
    const SCOPE = "email profile";
    // oauth 요청 URL
    const GOOGLE_AUTH_URL = `https://accounts.google.com/o/oauth2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=${SCOPE}`;
    // 구글 로그인 페이지로 리다이렉션
    window.location.href = GOOGLE_AUTH_URL
  }

  // 입력값 업데이트
  const handleChange = (e) => {
    const { id, value } = e.target
    setFormData({ ...formData, [id]: value })
  };

  // 폼 제출 처리
  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
        const response = await axios.post(
            `${API_BASE_URL}/user/signin`, 
            { userName: formData.userName, userPwd: formData.userPwd },
            { withCredentials: true }
        );
        if(response.status === 200) {
            const userData = response.data;
            
            setUser({
                userId: userData.userId,
                userEmail: userData.userEmail,
                userNick: userData.userNick,
                userName: userData.userName,
                userLikeList: userData.userLikeList || []
            });
            
            alert("로그인 성공")
            navigate("/home")
        }
    } catch (error) {
        console.error("로그인 실패: ", error)
        setError("아이디 또는 비밀번호가 일치하지 않습니다.")
    }
};

  return (
    <div className="login-page">
      <header className="login-header">
        <img src={logo} className="login-header-logo" onClick={handleLogoClick} />
      </header>

      <div className="login-body">
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
              <button className="social-button naver" onClick={handleNaverLogin}>네이버 로그인</button>
              <button className="social-button google" onClick={handleGoogleLogin}>구글 로그인</button>
            </div>
          </div>

          {/* 링크 섹션 */}
          <div className="links">
            <Link to="/find">아이디/비밀번호 찾기</Link>
            <Link to="/signup">회원가입</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;