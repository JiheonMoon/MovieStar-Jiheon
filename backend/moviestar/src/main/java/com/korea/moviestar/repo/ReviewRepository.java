package com.korea.moviestar.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.korea.moviestar.entity.ReviewEntity;

@Repository
public interface ReviewRepository extends JpaRepository<ReviewEntity, Integer>{
	List<ReviewEntity> findByUserUserId(int userId);
	List<ReviewEntity> findByMovieMovieId(int movieId);
	
	// 유저와 영화 ID로 리뷰 중복 여부 확인
	boolean existsByUserUserIdAndMovieMovieId(int userId, int movieId);
}
