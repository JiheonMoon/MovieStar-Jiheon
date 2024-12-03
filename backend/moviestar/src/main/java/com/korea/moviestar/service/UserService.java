package com.korea.moviestar.service;

import java.util.List;
import java.util.stream.Collectors;

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
}
