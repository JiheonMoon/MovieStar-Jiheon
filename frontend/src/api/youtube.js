import axios from "axios";

// YouTube API 키 환경변수에서 불러오기
const YOUTUBE_API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY;

// YouTube API를 통해 영화 예고편 검색 함수
export const searchYouTubeTrailer = async (query) => {
  try {
    const response = await axios.get("https://www.googleapis.com/youtube/v3/search", {
      params: {
        key: YOUTUBE_API_KEY,
        q: query,
        type: "video",
        part: "snippet",
        maxResults: 1,
        // 한국어로 제한
        relevanceLanguage: "ko",
        // 예고편 관련 비디오 필터링
        videoCategoryId: "44" // 예고편/트레일러 카테고리
      }
    });

    // 검색 결과가 있는지 확인
    if (response.data.items && response.data.items.length > 0) {
      return response.data.items[0];
    }

    return null;
  } catch (error) {
    console.error("YouTube 예고편 검색 중 오류:", error);
    throw error;
  }
};