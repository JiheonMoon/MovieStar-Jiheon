package com.korea.moviestar.security;

import java.security.Key;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;

import org.springframework.stereotype.Service;

import com.korea.moviestar.entity.UserEntity;

import io.jsonwebtoken.*;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Service
public class TokenProvider {
	private final Key key;
	
	public TokenProvider() {
        this.key = Keys.secretKeyFor(SignatureAlgorithm.HS256);
    }
	
	public String create(UserEntity userEntity) {
		Date expiryDate = Date.from(
				Instant.now()
				.plus(1, ChronoUnit.DAYS));
		
		return Jwts.builder()
				.signWith(key, SignatureAlgorithm.HS256) //서명
				.setSubject(Integer.toString(userEntity.getUserId())) // sub
				.setIssuer("MovieStar") // iss
				.setIssuedAt(new Date()) // iat
				.setExpiration(expiryDate) // exp
				.compact();
	}
	public String validateAndGetUserId(String token) {
		Claims claims = Jwts.parser()
						.setSigningKey(key) //키 확인
						.parseClaimsJws(token) //파싱 + 검증
						.getBody();

		return claims.getSubject();
	}

//	public String getUserIdFromToken(String token) {
//	    try {
//	        // JWT Secret Key: 서버에서 설정한 비밀키를 사용 (예: application.properties에 정의한 값)
//	        String secretKey = "a-very-secure-and-long-secret-key-for-jwt-256bits"; // 반드시 256-bit 이상으로 설정
//
//	        // Signing Key 생성
//	        Key key = Keys.hmacShaKeyFor(secretKey.getBytes());
//
//	        // Token에서 Claims 추출
//	        Claims claims = Jwts.parserBuilder()
//	                .setSigningKey(key)
//	                .build()
//	                .parseClaimsJws(token)
//	                .getBody();
//
//	        // Claims에서 사용자 ID 추출 (예: "userId" 클레임에 저장)
//	        return claims.get("userId", String.class);
//
//	    } catch (Exception e) {
//	        // 토큰 파싱 실패 시 예외 처리
//	        e.printStackTrace();
//	        return null; // 또는 예외를 throw할 수도 있음
//	    }
//	}

}
