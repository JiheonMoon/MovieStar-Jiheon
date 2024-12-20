package com.korea.moviestar.repo;

import java.time.LocalDateTime;
<<<<<<< HEAD
import java.util.List;
=======
>>>>>>> 7763f4933ed4f003a847e547c01e59a882790ffb
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.korea.moviestar.entity.MailVerificationEntity;

import jakarta.transaction.Transactional;

@Repository
public interface MailVerificationRepository extends JpaRepository<MailVerificationEntity, Integer>{
<<<<<<< HEAD
	List<MailVerificationEntity> findByEmail(String email);
=======
	Optional<MailVerificationEntity> findByEmail(String email);
>>>>>>> 7763f4933ed4f003a847e547c01e59a882790ffb
	
	@Modifying
    @Transactional
    @Query("DELETE FROM MailVerificationEntity e WHERE e.expiresAt < :now")
    void deleteExpiredEntities(@Param("now") LocalDateTime now);
}
