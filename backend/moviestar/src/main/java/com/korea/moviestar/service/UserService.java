package com.korea.moviestar.service;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.korea.moviestar.dto.UserDTO;
import com.korea.moviestar.entity.MovieEntity;
import com.korea.moviestar.entity.UserEntity;
import com.korea.moviestar.repo.MovieRepository;
import com.korea.moviestar.repo.UserRepository;


import jakarta.transaction.Transactional;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository repository;
    private final MovieRepository movies;
    
    public List<UserDTO> findAll(){
        List<UserEntity> entities = repository.findAll();
        return entities.stream().map(UserDTO::new).collect(Collectors.toList());
    }

    public UserDTO createUser(UserDTO dto) {
        // 아이디 중복 확인
        if (repository.existsByUserName(dto.getUserName())) {
            throw new RuntimeException("이미 사용 중인 아이디입니다.");
        }
        
        // 닉네임 중복 확인
        if (repository.existsByUserNick(dto.getUserNick())) {
            throw new RuntimeException("이미 사용 중인 닉네임입니다.");
        }
        
        //이메일 중복 확인
        if(repository.existsByUserEmail(dto.getUserEmail())) {
            throw new RuntimeException("이미 사용 중인 이메일입니다.");
        }
        
        // 중복 검사 통과 시 사용자 저장
        dto.setUserLikeList(new HashSet<Integer>());
        UserEntity entity = repository.save(UserService.toEntity(dto, movies));
        UserDTO response = new UserDTO(entity);
        return response.hidePwd();
    }

    public UserDTO findByEmail(String email) {
        UserEntity user = repository.findByUserEmail(email)
            .orElseThrow(() -> new RuntimeException(email+"해당 이메일로 등록된 사용자를 찾을 수 없습니다."));
        return UserDTO.fromEntity(user).hidePwd();
    }
    
    public UserDTO findByUserId(int userId) {
        Optional<UserEntity> origin = repository.findById(userId);
        if(origin.isPresent()) {
            UserEntity entity = origin.get();
            return new UserDTO(entity);
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
    
    public UserDTO addLike(String userId, int movieId) {
        try {
            log.info("Adding like - userId: {}, movieId: {}", userId, movieId);
            
            int user = Integer.parseInt(userId);
            Optional<UserEntity> origin = repository.findById(user);
            
            if(origin.isPresent()) {
                UserEntity entity = origin.get();
                log.info("Found user entity: {}", entity);
                
                Set<MovieEntity> newList = entity.getUserLikeList();
                if(newList == null) {
                    newList = new HashSet<>();
                }
                
                Optional<MovieEntity> movieEntity = movies.findById(movieId);
                if(!movieEntity.isPresent()) {
                    log.error("Movie not found with id: {}", movieId);
                    return null;
                }
                
                newList.add(movieEntity.get());
                entity.setUserLikeList(newList);
                
                UserEntity savedEntity = repository.save(entity);
                log.info("Successfully saved user entity with updated likes");
                
                return new UserDTO(savedEntity).hidePwd();
            } else {
                log.error("User not found with id: {}", userId);
                return null;
            }
        } catch (Exception e) {
            log.error("Error in addLike method", e);
            throw e;
        }
    }
    
    public UserDTO deleteLike(String userId, int movieId) {
        int user = Integer.parseInt(userId);
        Optional<UserEntity> origin = repository.findById(user);
        if(origin.isPresent()) {
            UserEntity entity = origin.get();
            Set<MovieEntity> newList = entity.getUserLikeList();
            newList.remove(movies.findById(movieId).get());
            entity.setUserLikeList(newList);
            return new UserDTO(repository.save(entity)).hidePwd();
        }else {
            return null;
        }
    }
    
    public UserDTO update(UserDTO dto) {
        Optional<UserEntity> origin = repository.findById(dto.getUserId());
        if(origin.isPresent()) {
            UserEntity entity = origin.get();
            // 아이디 중복 확인
            if (!dto.getUserName().equals(entity.getUserName()) && repository.existsByUserName(dto.getUserName()) ) {
                throw new RuntimeException("이미 사용 중인 아이디입니다.");
            }
            
            // 닉네임 중복 확인
            if (!dto.getUserNick().equals(entity.getUserNick()) &&repository.existsByUserNick(dto.getUserNick())) {
                throw new RuntimeException("이미 사용 중인 닉네임입니다.");
            }
            
            //이메일 중복 확인
            if(!dto.getUserEmail().equals(entity.getUserEmail()) &&repository.existsByUserEmail(dto.getUserEmail())) {
                throw new RuntimeException("이미 사용 중인 이메일입니다.");
            }
            
            entity.setUserName(dto.getUserName());
            entity.setUserNick(dto.getUserNick());
            entity.setUserEmail(dto.getUserEmail());
            return new UserDTO(repository.save(entity)).hidePwd();
        }
        return null;
    }
    

    @Transactional
	public UserDTO updatePwd(String userEmail, String pwd) {
		UserDTO dto = findByEmail(userEmail);
		if (dto == null) {
	        throw new RuntimeException("해당 이메일로 등록된 사용자를 찾을 수 없습니다.");
	    }
		// 새 비밀번호를 로그로 출력해서 확인
	    log.info("New password: " + pwd);
	    
	    // 비밀번호 설정
	    dto.setUserPwd(pwd);  

	    // 저장된 엔티티의 비밀번호 확인
	    UserEntity userEntity = toEntity(dto, movies);
	    log.info("Saved user entity password: " + userEntity.getUserPwd());

	    // 업데이트된 사용자 정보를 저장하고 DTO로 반환
	    return new UserDTO(repository.save(userEntity));
	}

    
    public static UserEntity toEntity(UserDTO dto, MovieRepository movies) {
        return UserEntity.builder()
                    .userId(dto.getUserId())
                    .userNick(dto.getUserNick())
                    .userName(dto.getUserName())
                    .userEmail(dto.getUserEmail())
                    .userPwd(dto.getUserPwd())
                    .userLikeList(dto.getUserLikeList().stream()
                        .map(movieId -> movies.findById(movieId))
                        .filter(Optional::isPresent)
                        .map(Optional::get)
                        .collect(Collectors.toSet()))
                    .build();
    }
}