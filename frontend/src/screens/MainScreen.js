import React, { useEffect, useState, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { fetchPopularMovies, fetchNowPlayingMovies, fetchTopRatedMovies, searchMovies, fetchGenres, fetchMoviesByGenre } from "../api/tmdb.js";
import { AppContext } from "../context/AppContext.js";
import MovieDetail from "../components/MovieDetail.js";
import MovieSlider from "../components/MovieSlider.js";
import axios from "axios";
import logo from "../logo/logo.png"
import { API_BASE_URL } from "../api/api-config.js";

import '../css/main/MyPage.css';
import "../css/main/Header.css"
import "../css/main/TopRecommendation.css"
import "../css/main/GenreList.css"

const TopRecommendation = ({ movies, onMovieSelect }) => {
  // 현재 보여줄 영화의 인덱스 상태 관리
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // 영화 데이터가 없으면 종료
    if (!movies || movies.length === 0) return;

    // 5초마다 다음 추천 영화로 자동 전환
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % movies.length);
    }, 5000);

    // 컴포넌트 언마운트 시 인터벌 정리
    return () => clearInterval(interval);
  }, [movies]);

  if (!movies || movies.length === 0) return null;

  return (
    <div className="top-recommendation-container">
      {/* 모든 추천 영화를 렌더링하지만 현재 인덱스의 영화만 활성화 */}
      {movies.map((movie, index) => (
        <div
          key={movie.movieId}
          className={`top-recommendation ${index === currentIndex ? "active" : "inactive"
            }`}
          onClick={() => onMovieSelect(movie)} // 영화 클릭 시 모달 오픈
        >
          {/* 영화 배경 이미지 */}
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.movieBackdrop}`}
            alt={movie.movieName}
            className="top-recommendation-poster"
          />
          <div className="recommendation-info">
            <h2>{movie.movieName}</h2>
            <p>{movie.movieOverview}</p>
          </div>
        </div>
      ))}
    </div>
  );
};


// 메인 홈페이지 컴포넌트
const HomePage = () => {
  // 유저 관리 컨텍스트
  const { user, setUser } = useContext(AppContext)

  // 다양한 영화 리스트 상태 관리
  const [popularMovies, setPopularMovies] = useState([]);
  const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [movies, setMovies] = useState({});
  const sectionRef = useRef({});

  // 검색 관련 상태 관리
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredMovies, setFilteredMovies] = useState([]);

  // 선택된 영화 모달 상태 관리
  const [selectedMovie, setSelectedMovie] = useState(null);

  // 모달 여부에 따라 장르바 보여줄 지 여부에 대한 상태 관리
  const [showNav, setShowNav] = useState(true)

  // 화면 이동 함수 정의
  const navigate = useNavigate()

  // 로고 클릭 시 메인화면 띄우기(추후 마이페이지에서 활용)
  const handleLogoClick = () => {
    navigate("/home")

  }

  // 로그인 버튼 클릭 시
  const navigateToLoginScreen = () => {
    navigate("/login") // LoginScreen으로 이동
  }

  // 로그아웃 버튼 클릭 시
  const handleLogout = () => {

    axios.post(`${API_BASE_URL}/user/logout`, {}, { withCredentials: true })
      .then(() => {
        setUser(null) // 사용자 로그아웃 처리
        alert("로그아웃 처리되었습니다")
      }).catch((error) => {
        console.log(error)
        setUser(null) // 사용자 로그아웃 처리

      })

  }

  // 마이페이지로 이동하는 함수
  const navigateToMyPage = () => {
    navigate("/mypage")
  }

  useEffect(() => {
    axios.get(`${API_BASE_URL}/user/secure-data`, { withCredentials: true })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          console.log("Invalid token, logging out...");
          // 로그아웃 처리
          handleLogout();
        } else {
          console.log("Error: ", error.message);
        }
      })
  }, [])

  // 컴포넌트 마운트 시 영화 데이터 초기 로딩
  useEffect(() => {
    const fetchMovies = async () => {
      // 다양한 카테고리의 영화 데이터 fetch
      const popular = await fetchPopularMovies();
      const nowPlaying = await fetchNowPlayingMovies();
      const topRated = await fetchTopRatedMovies();

      // 상태 업데이트
      setPopularMovies(popular);
      setNowPlayingMovies(nowPlaying);
      setTopRatedMovies(topRated);
    };

    fetchMovies();
  }, []);

  useEffect(() => {
    // 장르 목록을 가져옵니다
    fetchGenres().then((genreList) => {

      setGenres(genreList); // 장르 목록을 상태로 설정

      // 각 장르의 영화 가져오기
      genreList.forEach((genre) => {

        fetchMoviesByGenre(genre.themeId).then((moviesByGenre) => {

          if (moviesByGenre) {
            setMovies((prevMovies) => ({
              ...prevMovies,
              [genre.themeId]: moviesByGenre, // 장르별 영화 상태 업데이트
            }));
          } else {
            console.log(`No movies found for genre: ${genre.themeId}`);
          }
        });
      });
    }).catch((error) => {
      console.error("Error fetching genres:", error);
    });
  }, []);

  useEffect(() =>{
    !searchQuery&&setFilteredMovies([])
  },[searchQuery])

  const handleNavClick = (genreId) => {
    fetchMoviesByGenre(genreId).then((movies) => {
      setMovies((prevMovies) => ({
        ...prevMovies,
        [genreId]: movies,
      }));
    });

    const section = sectionRef.current[genreId];
    if (section) {
      const offsetTop = section.offsetTop;
      const scrollPosition = offsetTop - 200;

      window.scrollTo({
        top: scrollPosition,
        behavior: "smooth",
      });
    }
  };

  // 영화 검색 핸들러
  const handleSearch = async () => {
    if (searchQuery) {
      // 검색어가 있으면 영화 검색 API 호출
      const searchResults = await searchMovies(searchQuery);
      setFilteredMovies(searchResults);
      if (searchResults == []) {
        alert("검색어가 제목에 포함된 영화가 존재하지 않습니다")
      }
    } else {
      // 검색어가 없으면 검색 결과 초기화
      setFilteredMovies([]);
    }
  };

  // 영화 선택 시 모달 오픈 핸들러
  const handleMovieSelect = (movie) => {
    setSelectedMovie(movie);
    setShowNav(false)
  };

  // 영화 모달 닫기 핸들러
  const handleCloseMovieDetail = () => {
    setSelectedMovie(null);
    setShowNav(true)
  };

  return (
    <div className="main-page">
      {showNav && (
        <div className="header-navbar">
          <header className="main-header">
            <img src={logo} className="main-logo" onClick={handleLogoClick} />
            {/* 영화 검색 입력창 */}
            <div style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", width: "50%" }}>
              <input
                type="text"
                className="search-bar"
                placeholder="Search Movies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="mypage-button-main" onClick={handleSearch}>검색</button>
            </div>
            {/* 로그인, 로그아웃 버튼 */}
            <div className="button-group">
              {user ? (
                <>
                  <button onClick={navigateToMyPage} className="mypage-button-main">
                    마이페이지
                  </button>
                  <button onClick={handleLogout} className="logout-button-main">
                    로그아웃
                  </button>
                </>
              ) : (
                <button onClick={navigateToLoginScreen} className="login-button-main">
                  로그인
                </button>
              )}
            </div>
          </header>
          { (!searchQuery || filteredMovies.length === 0) &&
            (<nav className="nav-bar">
              {genres.map((genre) => (
                <button
                  key={genre.themeId}
                  onClick={() => handleNavClick(genre.themeId)}
                  className="nav-item"
                >
                  {genre.themeName}
                </button>
              ))}
            </nav>)}
        </div>
      )}

      {/* 검색 결과 또는 기본 영화 리스트 조건부 렌더링 */}
      {searchQuery && filteredMovies.length > 0 ? (
        <MovieSlider
          title="검색 결과"
          movies={filteredMovies}
          onMovieSelect={handleMovieSelect}
        />
      ) : (
        <>
          {/* 추천 섹션 및 다양한 카테고리 영화 슬라이더 */}
          <TopRecommendation
            movies={popularMovies}
            onMovieSelect={handleMovieSelect}
          />
          <MovieSlider
            title="인기 영화"
            movies={popularMovies}
            onMovieSelect={handleMovieSelect}
          />
          <MovieSlider
            title="현재 상영 중"
            movies={nowPlayingMovies}
            onMovieSelect={handleMovieSelect}
          />
          <MovieSlider
            title="높은 평점 영화"
            movies={topRatedMovies}
            onMovieSelect={handleMovieSelect}
          />
          <div className="genre-movie-list">
            {genres.map((genre) => (
              <div key={genre.themeId} ref={(el) => (sectionRef.current[genre.themeId] = el)}>
                <MovieSlider
                  title={genre.themeName}
                  movies={movies[genre.themeId] || []}
                  onMovieSelect={handleMovieSelect}
                />
              </div>
            ))}
          </div>
        </>
      )}

      {/* 영화 선택 시 모달 렌더링 */}
      {selectedMovie && (
        <MovieDetail
          movieId={selectedMovie.movieId}
          onClose={handleCloseMovieDetail}
        />
      )}
    </div>
  );
};

export default HomePage