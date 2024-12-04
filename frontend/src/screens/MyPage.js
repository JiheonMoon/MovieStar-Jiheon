import React,{useState,useContext} from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const Mypage = () => {
    const {user,setUser} = useContext(AppContext);
    const navigate = useNavigate();
    const [isEditing , setIsEditing] = useState();
    const [editedUser,setEditedUser] = useState({
        userName: user?.userName || '',
        userNick: user?.userNick || '' ,
        userEmail: user?.userEmail || ''
    }); 

    //로그인되지 않은 경우 리다이렉트
    if(!user) {
        navigate('/login');
        return null;
    }

    const handleLogout = () => {
        setUser(null);
        navigate('/home');
    }

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    }

    const handleInputChange = (e) => {
        const {name,value} = e.target;
        setEditedUser(prev => ({
            ...prev,
            [name]:value
        }));
    }

    const handleSaveProfile = () => {

    }


    return (
        <div className="mypage-container">
            <h1>마이페이지</h1>
            <div className="profile-section">
                <h2>프로필 정보</h2>
                {isEditing ? (
                    <div className="profile-edit">
                        <div>
                            <label>아이디</label>
                            <input 
                                type="nickName" 
                                name="userName"
                                value={editedUser.userName}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <label>닉네임</label>
                            <input 
                                type="text" 
                                name="userNick"
                                value={editedUser.userNick}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="profile-actions">
                            <button onClick={handleSaveProfile}>저장</button>
                            <button onClick={handleEditToggle}>취소</button>
                        </div>
                    </div>
                ) : (
                    <div className="profile-view">
                        <p><strong>아이디:</strong> {user.userName}</p>
                        <p><strong>닉네임:</strong> {user.userNick}</p>
                        <p><strong>이메일:</strong> {user.userEmail}</p>
                        <div className="profile-actions">
                            <button onClick={handleEditToggle}>프로필 수정</button>
                        </div>
                    </div>
                )}
            </div>

            <div className="liked-movies-section">
                <h2>좋아요 표시한 영화</h2>
                {user.userLikeList && user.userLikeList.length > 0 ? (
                    <div className="liked-movies-grid">
                        {user.userLikeList.map(movie => (
                            <div key={movie.id} className="liked-movie-item">
                                <img 
                                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                                    alt={movie.title} 
                                />
                                <p>{movie.title}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>좋아요 표시한 영화가 없습니다.</p>
                )}
            </div>

            <div className="mypage-actions">
                <button onClick={handleLogout} className="logout-button">로그아웃</button>
            </div>
        </div>
    );
};

export default Mypage;




