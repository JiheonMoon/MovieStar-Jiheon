import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../../context/AppContext";
import { useNavigate } from "react-router-dom";
import { IoHome } from "react-icons/io5";
import logo from "../../logo/logo.png"
import axios from "axios";

import "../../css/main/ChangePwd.css" 


const PwdChangeScreen = () => {
    const navigate = useNavigate();

    const [email,setEmail] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmNewPassword, setConfirmNewPassword] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const {setUser} = useContext(AppContext)

    const emailCheck = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/
    const passwordCheck = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    const handleChangePassword = () => {
        if(!newPassword && !confirmNewPassword){
            setErrorMessage('모든 항목을 입력해주세요')
            return false;
        }

        if(newPassword !== confirmNewPassword) {
            setErrorMessage('비밀번호가 일치하지 않습니다.')
            return false;
        }
        if(newPassword.length < 6){
            setErrorMessage('비밀번호는 최소 6자 이상이여야합니다.')
            return false;
        }
        if(!passwordCheck.test(newPassword)){
            setErrorMessage('비밀번호는 최소 8자 이상이며, 대소문자, 숫자, 특수문자가 포함되어야 합니다.')
            return false;
        }

        setErrorMessage('')
        return true;

    }

    const handleSubmit = async () => {
        if (handleChangePassword()) {
            try {
                const response = await axios.put(
                    `/user/modifyPwd?email=${email}`, 
                    {userPwd: newPassword},
                    {   
                        headers:
                        {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + localStorage.getItem('token')
                         },
                        withCredentials: true,
                    }
                );

                console.log("서버 응답:", response);
                if (response.status === 200) {
                    console.log('비밀번호가 변경되었습니다.');
                    alert("비밀번호가 변경되었습니다.");
                    const userData = response.data;
                    setUser({
                        userId: userData.userId,
                        userEmail: userData.userEmail,
                        userNick: userData.userNick,
                        userName: userData.userName,
                      });
                
                    navigate('/Home');
                } else {
                    setErrorMessage(response.data.message || '비밀번호 변경에 실패했습니다.');
                }
    
            } catch (error) {
                setErrorMessage('서버 오류가 발생했습니다. 다시 시도해주세요.');
                console.error('로그인 실패: ', error);
            }
        }
    };

        


    return(
        <div className="pwd-page">
            <header className="main-header">
                <img src={logo} className="main-logo" onClick={()=>navigate('/Home')}/>
                <div>
                    <button
                        onClick={()=>navigate('/Home')}>
                        <IoHome/>
                    </button>
                </div>
            </header>
                <div className="input-boxs">
                    <h1 className="h1s">비밀번호 변경</h1>
                    <div className="input-groups">
                        <label>이메일</label>
                        <input
                            type="email"
                            name="email"
                            value={email}
                            onChange={(e)=>setEmail(e.target.value)}
                            placeholder="이메일 입력"
                        />
                    </div>
                    <div className="input-groups">
                        <label>새 비밀번호</label>
                        <input
                            type="text"
                            name="newPassword"
                            value={newPassword}
                            onChange={(e)=>setNewPassword(e.target.value)}
                            placeholder="새 비밀번호 입력"
                        />
                    </div>
                    <div className="input-groups">
                        <label>새 비밀번호 확인</label>
                        <input
                            type="password"
                            name="confirmNewPassword"
                            value={confirmNewPassword}
                            onChange={(e)=>setConfirmNewPassword(e.target.value)}
                            placeholder="새 비밀번호 다시 입력"
                        />
                    </div>
                    <button className="login-buttons" onClick={handleSubmit}>
                        비밀번호 변경
                    </button>
                    {errorMessage && <div className="error-messages">{errorMessage}</div>}
                </div>
            
        </div>
    )


}

export default PwdChangeScreen;