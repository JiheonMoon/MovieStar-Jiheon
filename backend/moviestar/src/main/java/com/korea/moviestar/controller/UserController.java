package com.korea.moviestar.controller;


import java.util.List;
import java.util.Map;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.korea.moviestar.dto.ResponseDTO;
import com.korea.moviestar.dto.UserDTO;
import com.korea.moviestar.entity.UserEntity;
import com.korea.moviestar.repo.MovieRepository;
import com.korea.moviestar.security.TokenProvider;
import com.korea.moviestar.service.MailService;
import com.korea.moviestar.service.UserService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("user")
public class UserController {
	private final UserService service;
	private final MovieRepository movies;
	private final MailService mails;
	private final TokenProvider tokenProvider;
	
	private PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

	
	@GetMapping("/all")
	public ResponseEntity<?> userList(){
		List<UserDTO> dtos = service.findAll();
		ResponseDTO<UserDTO> response = ResponseDTO.<UserDTO>builder().data(dtos).build();
		return ResponseEntity.ok().body(response);
	}
	
	@GetMapping("/{userId}")
	public ResponseEntity<?> userById(@PathVariable int userId){
		UserDTO dto = service.findByUserId(userId);
		return ResponseEntity.ok().body(dto);
	}
	
	@GetMapping("/private/mine")
	public ResponseEntity<?> myUser(@AuthenticationPrincipal String userId){
		UserDTO response = service.findByUserId(Integer.parseInt(userId));
		return ResponseEntity.ok().body(response);
	}
	
	@PostMapping("/signin")
	public ResponseEntity<?> signin(@RequestBody UserDTO dto) {
	    UserDTO find = service.findUser(dto, passwordEncoder);

	    if (find == null || !passwordEncoder.matches(dto.getUserPwd(), find.getUserPwd())) {
	        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password");
	    }

	    // 토큰 생성
	    UserEntity user = UserService.toEntity(find, movies);
	    final String token = tokenProvider.create(user);

	    ResponseCookie cookie = ResponseCookie.from("token", token)
	            .httpOnly(true) // 클라이언트에서 접근 불가
	            .secure(true)   // HTTPS에서만 전송
	            .path("/")      // 모든 경로에서 사용 가능
	            .maxAge(60 * 60 * 24) // 1일
	            .build();

	    return ResponseEntity.ok()
	            .header(HttpHeaders.SET_COOKIE, cookie.toString())
	            .body(find);
	}
	
//	@GetMapping("/verify-token")
//	public ResponseEntity<?> getCurrentUser(@CookieValue("token") String token) {
//	    try {
//	        String userId = tokenProvider.getUserIdFromToken(token);
//	        UserDTO user = service.findByUserId(Integer.parseInt(userId));
//	        return ResponseEntity.ok(user);
//	    } catch (Exception e) {
//	        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired token");
//	    }
//	}
	
	@PostMapping("/logout")
	public ResponseEntity<?> logout() {
	    ResponseCookie cookie = ResponseCookie.from("token", null)
	            .httpOnly(true)
	            .secure(true)
	            .path("/")
	            .maxAge(0) // 즉시 만료
	            .build();

	    return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, cookie.toString()).body("Logged out");
	}
	
	@GetMapping("/find-id")
	public ResponseEntity<?> findIdByEmail(@RequestParam String email) {
	    try {
	        UserDTO user = service.findByEmail(email); // 이메일로 사용자 검색
	        return ResponseEntity.ok().body(Map.of(
	            "success", true,
	            "userName", user.getUserName() // 찾은 아이디 반환
	        ));
	    } catch (RuntimeException e) {
	        return ResponseEntity.badRequest().body(Map.of(
	            "success", false,
	            "message", "해당 이메일로 등록된 아이디를 찾을 수 없습니다."
	        ));
	    }
	}

	@PostMapping("/signup")
	public ResponseEntity<?> signup(@RequestBody UserDTO dto){
		try {
			dto.setUserPwd(passwordEncoder.encode(dto.getUserPwd()));
			UserDTO response = service.createUser(dto);
			return ResponseEntity.ok().body(Map.of(
					"success", true,
					"message", "Signup successed",
					"data", response
					));
		} catch (Exception e) {
			return ResponseEntity.badRequest().body(Map.of(
					"success", false,
					"message", e.getMessage()
					));
		}
	}
	
	@PostMapping("/request_verification")
	public ResponseEntity<?> requestVerification(@RequestParam String email) {
	    mails.sendVerificationCode(email);
	    return ResponseEntity.ok().body("인증 코드가 전송되었습니다");
	}
	
	@PostMapping("/verify_email")
	public ResponseEntity<?> verifyEmail(@RequestParam String email, @RequestParam String code) {
	    if (mails.verifyCode(email, code, passwordEncoder)) {
	        return ResponseEntity.ok().body("이메일 인증 성공");
	    }
	    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("인증 실패");
	}
	
	
	@PutMapping("/private/like")
	public ResponseEntity<?> likeMovie(@AuthenticationPrincipal String userId, @RequestBody int movieId){
		UserDTO response = service.addLike(userId, movieId);
		return ResponseEntity.ok().body(response);
	}
	
	@DeleteMapping("/private/dislike")
	public ResponseEntity<?> dislikeMovie(@AuthenticationPrincipal String userId, @RequestBody int movieId){
		UserDTO response = service.deleteLike(userId, movieId);
		return ResponseEntity.ok().body(response);
	}
	
	@PutMapping("/private/modify")
	public ResponseEntity<?> modifyUser(@RequestBody UserDTO dto){
		try {
			dto.setUserPwd(passwordEncoder.encode(dto.getUserPwd()));
			UserDTO response = service.update(dto);
			return ResponseEntity.ok().body(response);
		} catch (Exception e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
		
	}
	
	@PutMapping("/modifyPwd")
	public ResponseEntity<?> modifyPwd(@RequestParam String email, @RequestBody String pwd){
		try {
			String newPwd = passwordEncoder.encode(pwd);
			UserDTO response = service.updatePwd(email, newPwd);
			return ResponseEntity.ok().body(response);
		} catch (Exception e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
		
	}
	
}
