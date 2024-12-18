package com.korea.moviestar.repo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.korea.moviestar.entity.MailVerificationEntity;

@Repository
public interface MailVerificationRepository extends JpaRepository<MailVerificationEntity, Integer>{
	List<MailVerificationEntity> findByEmail(String email);
}
