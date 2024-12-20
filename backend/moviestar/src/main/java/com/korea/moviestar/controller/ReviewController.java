package com.korea.moviestar.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.korea.moviestar.dto.ResponseDTO;
import com.korea.moviestar.dto.ReviewDTO;
import com.korea.moviestar.service.ReviewService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/review")
public class ReviewController {

	private final ReviewService service;
	
	@GetMapping("/all")
	public ResponseEntity<?> reviewList(){
		List<ReviewDTO> dtos = service.findAll();
		ResponseDTO<ReviewDTO> response = ResponseDTO.<ReviewDTO>builder().data(dtos).build();
		return ResponseEntity.ok().body(response);
	}
	
	@GetMapping("/private/myreview")
	public ResponseEntity<?> reviewByUserId(@AuthenticationPrincipal String userId){
		List<ReviewDTO> dtos = service.findByUserId(userId);
		ResponseDTO<ReviewDTO> response = ResponseDTO.<ReviewDTO>builder().data(dtos).build();
		return ResponseEntity.ok().body(response);
	}
	
	// 특정 영화의 리뷰 조회(로그인하지 않아도 가능)
	@GetMapping("/{movieId}")
	public ResponseEntity<?> reviewByMovieId(@PathVariable int movieId){
		List<ReviewDTO> dtos = service.findByMovieId(movieId);
		ResponseDTO<ReviewDTO> response = ResponseDTO.<ReviewDTO>builder().data(dtos).build();
		return ResponseEntity.ok().body(response);
	}
	
	// 리뷰 작성(로그인해야 가능)
	@PostMapping("/private/write")
	public ResponseEntity<?> writeReview(@AuthenticationPrincipal String userId, @RequestBody ReviewDTO dto) {
	    try {
	        // 서비스에서 중복 검사를 포함한 리뷰 작성 처리
	        ReviewDTO response = service.create(userId, dto);
	        return ResponseEntity.ok().body(response);
	    } catch (RuntimeException e) {
	        // 중복 리뷰 예외 처리
	        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
	                .body(Map.of("message", e.getMessage()));
	    } catch (Exception e) {
	        // 기타 예외 처리
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
	                .body(Map.of("message", "리뷰 등록 중 문제가 발생했습니다.", "error", e.getMessage()));
	    }
	}

	
	@PutMapping("/private/modify/{reviewId}")
	public ResponseEntity<?> modifyReview(@PathVariable int reviewId, @RequestBody ReviewDTO dto){
		ReviewDTO response = service.update(reviewId, dto);
		return ResponseEntity.ok().body(response);
	}
	
	@DeleteMapping("/private/remove/{reviewId}")
	public ResponseEntity<?> removeReview(@PathVariable int reviewId){
		if(service.delete(reviewId)) {
			return ResponseEntity.ok().body("succesfully remove");
		}else {
			return ResponseEntity.badRequest().body("fail to remove");
		}
	}
	
}
