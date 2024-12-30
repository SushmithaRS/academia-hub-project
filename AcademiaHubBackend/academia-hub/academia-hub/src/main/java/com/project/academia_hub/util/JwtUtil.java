package com.project.academia_hub.util;

import io.jsonwebtoken.*;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JwtUtil {

    private final String secretKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9eyJzdWIiOiJzdXNobWl0aGFAdGVzdC5jb20iLCJleHBpcnkiOiJzdXNobWl0aGFAc2VjdXJlIiwiaWF0IjoxNjYxMDEwMjYxLCJleHBpcmF0aW9uIjoxNjYxMDEzMjYxLCJyb2xlcyI6WyJVc2VyIl19SNhLJbCtiC9EjpS4dANVpshoNe5ZkgrSxdKaOVbyA";
    private final long validityInMilliseconds = 3600000; // 1 hour

    public String createToken(String username) {
        Claims claims = Jwts.claims().setSubject(username);

        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + validityInMilliseconds))
                .signWith(SignatureAlgorithm.HS256, secretKey)
                .compact();
    }

    public String extractUsername(String token) {
        return Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token).getBody().getSubject();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }
}