import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AppContext } from "./context/AppContext.js";

import FirstPage from "./screens/FirstScreen.js";
import HomePage from "./screens/MainScreen.js";
import LoginScreen from "./screens/login/LoginScreen.js";
import FindId from "./screens/login/FindId.js";
import FindPassword from "./screens/login/FindPassword.js";
import Signup from "./screens/login/Signup.js";
import Mypage from "./screens/MyPage.js";

import "./App.css";
import "./css/main/Header.css";
import "./css/main/Slider.css";
import "./css/main/TopRecommendation.css";
import "./css/main/FirstPage.css";

// 앱의 루트 컴포넌트 - 라우터 설정
const App = () => {
  const [user, setUser] = useState(null);

  // //디폴트 사용자 설정으로 로그인 상태로 접속
  // const [user, setUser] = useState({
  //   userNick: "", // 예시 닉네임
  //   userLikeList: [], // 초기 좋아요 목록
  // });

  const [reviews, setReviews] = useState([]);

  // 좋아요 여부 확인 함수
  const isMovieLiked = (movieId) => {
    return user?.userLikeList?.some((movie) => movie.id === movieId);
  };

  // 좋아요 추가 함수
  const addLikeMovie = (movie) => {
    const updatedLikes = [...(user.userLikeList || []), movie];
    setUser({ ...user, userLikeList: updatedLikes });
  };

  // 좋아요 제거 함수
  const removeLikeMovie = (movieId) => {
    const updatedLikes = user.userLikeList.filter((movie) => movie.id !== movieId);
    setUser({ ...user, userLikeList: updatedLikes });
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        reviews,
        setReviews,
        isMovieLiked, 
        addLikeMovie, 
        removeLikeMovie,
      }}
    >
      <Router>
        <Routes>
          {/* 기본 경로는 홈페이지 */}
          <Route path="/" element={<FirstPage />} />
          <Route path="/Home" element={<HomePage />} />
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/find-id" element={<FindId />} />
          <Route path="/find-password" element={<FindPassword />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/mypage" element={<Mypage />} />
        </Routes>
      </Router>
    </AppContext.Provider>
  );
};

export default App;
