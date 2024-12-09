package com.korea.moviestar.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.korea.moviestar.entity.UserEntity;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Integer>{

	UserEntity findByUserName(String userName);
	boolean existsByUserName(String userName); // 아이디 중복 확인
	boolean existsByUserNick(String userNick); // 닉네임 중복 확인

}
