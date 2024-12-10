import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../../css/login/FindId.css";
import logo from "../../logo/logo.png"

const FindId = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const navigate = useNavigate();

    // 로고 클릭 시 메인화면 띄우기
    const handleLogoClick = () => {
        navigate("/home")
    }

    const handleFindId = async (e) => {
        e.preventDefault();

        if (!email) {
            setMessage("이메일을 입력해주세요.")
            return;
        }

        try {
            const response = await fetch(`/user/find-id?email=${email}`, {
                method: "GET",
            });

            const data = await response.json();

            if (data.success) {
                setMessage(`회원님의 아이디는 ${data.userName}입니다.`); // 성공 시 아이디 표시
            } else {
                setMessage(data.message); // 실패 시 에러 메시지 표시
            }
        } catch (error) {
            console.error("Error finding ID:", error);
            setMessage("아이디 찾기 중 오류가 발생했습니다.");
        }
    };

    return (
        <div>
            <div className="logo-box">
                <img src={logo} className="FindIdLogo" onClick={handleLogoClick}/>
            </div>
            <div className="find-id-container">
                <h2>아이디 찾기</h2>
                <form onSubmit={handleFindId}>
                    <div className="input-group">
                        <label htmlFor="email">가입 시 사용한 이메일</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="이메일을 입력하세요"
                            required
                        />
                    </div>
                    <button type="submit" className="find-id-button">아이디 찾기</button>
                </form>
                {message && (
                    <>
                        <p className="result-message">{message}</p>
                        {message === "해당 이메일로 등록된 아이디를 찾을 수 없습니다." ? (
                            <div className="additional-buttons">
                                <button
                                    className="signup-button-inFindID"
                                    onClick={() => navigate('/signup')}
                                >
                                    회원가입하기
                                </button>
                            </div>
                        ) : (
                            <div className="additional-buttons">
                                <button
                                    className="find-password-button"
                                    onClick={() => navigate('/find-password')}
                                >
                                    비밀번호 찾기
                                </button>
                                <button
                                    className="login-button-inFindID"
                                    onClick={() => navigate('/login')}
                                >
                                    로그인하기
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default FindId;
