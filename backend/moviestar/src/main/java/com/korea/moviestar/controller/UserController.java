package com.korea.moviestar.controller;

import java.util.Arrays;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.korea.moviestar.dto.ResponseDTO;
import com.korea.moviestar.dto.UserDTO;
import com.korea.moviestar.entity.UserEntity;
import com.korea.moviestar.security.TokenProvider;
import com.korea.moviestar.service.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("user")
public class UserController {
	private final UserService service;
	private final TokenProvider tokenProvider;
	
	private PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
	
	@GetMapping("/all")
	public ResponseEntity<?> userList(){
		List<UserDTO> dtos = service.findAll();
		ResponseDTO<UserDTO> response = ResponseDTO.<UserDTO>builder().data(dtos).build();
		return ResponseEntity.ok().body(response);
	}
	
	@PostMapping("/signin")
	public ResponseEntity<?> signin(@RequestBody UserDTO dto){
		UserDTO find = service.findUser(dto, passwordEncoder);
		
		if(find != null) {
			UserEntity user = UserDTO.toEntity(find);
			final String token = tokenProvider.create(user);
			UserDTO response = UserDTO.builder()
					.userId(user.getUserId())
					.userEmail(user.getUserEmail())
					.userNick(user.getUserNick())
					.userName(user.getUserName())
					.userLikeList(user.getUserLikeList())
					.token(token)
					.build();
			return ResponseEntity.ok().body(response);
		} else {
			ResponseDTO responseDTO = ResponseDTO.builder().error("Login failed.").build();
			return ResponseEntity.badRequest().body(responseDTO);
		}
	}
	
	@PostMapping("/signup")
	public ResponseEntity<?> signup(@RequestBody UserDTO dto){
		dto.setUserPwd(passwordEncoder.encode(dto.getUserPwd()));
		UserDTO response = service.createUser(dto);
		return ResponseEntity.ok().body(response);
	}
}
