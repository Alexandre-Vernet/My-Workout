package com.avernet.myworkoutapi.auth;

import com.avernet.myworkoutapi.user.UserEntity;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;

@Service
public class JwtService {

    static final String TOKEN_TYPE_CLAIM = "type";
    static final String TOKEN_VERSION_CLAIM = "ver";

    enum TokenType { ACCESS, REFRESH }

    @Value("${security.jwt.secret-key}")
    private String secretKey;

    @Value("${security.jwt.expiration-time}")
    private long jwtExpiration;

    @Value("${security.jwt.refresh.expiration-time}")
    private long jwtRefreshExpiration;

    /**
     * @throws JwtException if the token is malformed, expired or not signed with our key
     */
    public String extractUsername(String token) {
        return extractAllClaims(token).getSubject();
    }

    public String generateAccessToken(UserEntity user) {
        return buildToken(user, TokenType.ACCESS, jwtExpiration);
    }

    public String generateRefreshToken(UserEntity user) {
        return buildToken(user, TokenType.REFRESH, jwtRefreshExpiration);
    }

    public boolean isAccessTokenValid(String token, UserEntity user) {
        return isTokenValid(token, user, TokenType.ACCESS);
    }

    public boolean isRefreshTokenValid(String token, UserEntity user) {
        return isTokenValid(token, user, TokenType.REFRESH);
    }

    private String buildToken(UserEntity user, TokenType tokenType, long expiration) {
        long now = System.currentTimeMillis();
        return Jwts
            .builder()
            .subject(user.getUsername())
            .claim(TOKEN_TYPE_CLAIM, tokenType.name())
            .claim(TOKEN_VERSION_CLAIM, user.getTokenVersion())
            .issuedAt(new Date(now))
            .expiration(new Date(now + expiration))
            .signWith(getSignInKey(), Jwts.SIG.HS256)
            .compact();
    }

    // Expiration and signature are already enforced by the parser (it throws), so only the
    // claims tying the token to this user's current state are left to check here.
    private boolean isTokenValid(String token, UserEntity user, TokenType expectedType) {
        Claims claims = extractAllClaims(token);
        return user.getUsername().equals(claims.getSubject())
            && expectedType.name().equals(claims.get(TOKEN_TYPE_CLAIM, String.class))
            && claims.get(TOKEN_VERSION_CLAIM) instanceof Number version
            && version.intValue() == user.getTokenVersion();
    }

    private Claims extractAllClaims(String token) {
        return Jwts
            .parser()
            .verifyWith(getSignInKey())
            .build()
            .parseSignedClaims(token)
            .getPayload();
    }

    private SecretKey getSignInKey() {
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(secretKey));
    }
}
