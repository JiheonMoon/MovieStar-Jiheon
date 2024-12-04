package com.korea.moviestar.service;

import java.util.List;

import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.stereotype.Service;

import com.korea.moviestar.dto.UserDTO;
import com.korea.moviestar.entity.UserEntity;
import com.korea.moviestar.repo.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {
	private final UserRepository repository;
	
	public List<UserDTO> findAll(){
		List<UserEntity> entities = repository.findAll();
		return entities.stream().map(UserDTO::new).collect(Collectors.toList());
	}

	public UserDTO createUser(UserDTO dto) {
		UserEntity entity = repository.save(UserDTO.toEntity(dto));
		UserDTO response = UserDTO.builder()
			.userId(entity.getUserId())
			.userEmail(entity.getUserEmail())
			.userNick(entity.getUserNick())
			.userName(entity.getUserName())
			.userLikeList(entity.getUserLikeList())
			.build();
		return response;
	}
	
	public UserDTO findByUserId(int userId) {
		Optional<UserEntity> origin = repository.findById(userId);
		if(origin.isPresent()) {
			UserEntity entity = origin.get();
			UserDTO response = UserDTO.builder()
					.userId(entity.getUserId())
					.userEmail(entity.getUserEmail())
					.userNick(entity.getUserNick())
					.userName(entity.getUserName())
					.userLikeList(entity.getUserLikeList())
					.build();
			return response;
		}
		return null;
	}
	
	public UserDTO findUser(UserDTO dto, final PasswordEncoder encoder) {
		UserEntity origin = repository.findByUserName(dto.getUserName());
		if(origin != null && encoder.matches(dto.getUserPwd(), origin.getUserPwd())) {
			return new UserDTO(origin);
		}else {
			return null;
		}
	}
}
