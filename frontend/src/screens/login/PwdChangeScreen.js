import React, { useContext, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { useNavigate } from "react-router-dom";
import { IoHome } from "react-icons/io5";
import logo from "../../logo/logo.png"

const PwdChangeScreen = () => {
    const navigate = useNavigate();
    const {user, setUser} = useContext(AppContext)

    const [newPassword, setNewPassword] = useState('')
    const [confirmNewPassword, setConfirmNewPassword] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [successMessage, setSuccessMessage] = useState('')

    const emailCheck = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/
    const passwordCheck = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    const handleChangePassword = async() => {
        if(newPassword !== confirmNewPassword) {
            setErrorMessage('비밀번호가 일치하지 않습니다.')
            return;
        }
        if(newPassword.length < 6){
            setErrorMessage('비밀번호는 최소 6자 이상이여야합니다.')
            return;
        }
        if(!passwordCheck.test(newPassword)){
            setErrorMessage('비밀번호는 최소 8자 이상이며, 대소문자, 숫자, 특수문자가 포함되어야 합니다.')
            return;
        }
        try {
            const response = await fetch(`/user/modifyPwd`,{
                method:'POST'
            })
            const data = await response.json();
           
        } catch (error) {
            
        }
    }

        


    return(
        <div className="main-page">
            <header className="main-header">
                <img src={logo} className="main-logo" onClick={()=>navigate('/Home')}/>
                <div>
                    <button
                        onClick={()=>navigate('/Home')}>
                        <IoHome/>
                    </button>
                </div>
            </header>
                <h1>비밀번호 변경</h1>
                <div>
                    <div className="input-group">
                        <label>새 비밀번호</label>
                        <input
                            type="text"
                            name="newPassword"
                            value={newPassword}
                            onChange={(e)=>setNewPassword(e.target.value)}
                            placeholder="새 비밀번호 입력"
                        />
                    </div>
                    <div className="input-group">
                        <label>새 비밀번호 확인</label>
                        <input
                            type="text"
                            name="confirmNewPassword"
                            value={confirmNewPassword}
                            onChange={(e)=>setConfirmNewPassword(e.target.value)}
                            placeholder="새 비밀번호 다시 입력"
                        />
                    </div>
                    <button className="login-button">비밀번호 변경</button>
                </div>
            
        </div>
    )


}

export default PwdChangeScreen;