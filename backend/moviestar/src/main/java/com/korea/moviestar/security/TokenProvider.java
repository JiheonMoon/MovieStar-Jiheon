package com.korea.moviestar.security;

import java.security.Key;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;

import org.springframework.stereotype.Service;

import com.korea.moviestar.entity.UserEntity;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Service
public class TokenProvider {
    private final Key key;

    // Key 생성
    public TokenProvider() {
        this.key = Keys.secretKeyFor(SignatureAlgorithm.HS256);
    }

    // JWT 토큰 생성
    public String create(UserEntity userEntity) {
        Date expiryDate = Date.from(
                Instant.now()
                        .plus(1, ChronoUnit.DAYS)); // 만료 기간 설정 (1일)

        return Jwts.builder()
                .signWith(key, SignatureAlgorithm.HS256) // 서명
                .setSubject(Integer.toString(userEntity.getUserId())) // sub
                .setIssuer("MovieStar") // iss
                .setIssuedAt(new Date()) // iat
                .setExpiration(expiryDate) // exp
                .compact();
    }

    // JWT 토큰 검증 및 사용자 ID 추출
    public String validateAndGetUserId(String token) {
        try {
            // 파싱 및 서명 검증
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(key) // 키 설정
                    .build()
                    .parseClaimsJws(token) // 토큰 파싱 및 검증
                    .getBody();

            return claims.getSubject(); // 토큰에서 사용자 ID 반환
        } catch (JwtException | IllegalArgumentException e) {
            throw new RuntimeException("Invalid JWT token", e);
        }
    }
}

