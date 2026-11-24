package com.avernet.myworkoutapi.auth;

import com.avernet.myworkoutapi.user.UserEntity;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final String BEARER_PREFIX = "Bearer ";

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String path = request.getServletPath();
        if (path.startsWith("/auth/refresh") ||
            path.startsWith("/auth/login") ||
            path.startsWith("/auth/register") ||
            path.startsWith("/password-reset-token")) {
            filterChain.doFilter(request, response);
            return;
        }

        final String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith(BEARER_PREFIX) && SecurityContextHolder.getContext().getAuthentication() == null) {
            try {
                final String jwt = authHeader.substring(BEARER_PREFIX.length());
                final String userEmail = jwtService.extractUsername(jwt);
                UserDetails userDetails = userDetailsService.loadUserByUsername(userEmail);

                if (userDetails instanceof UserEntity user && jwtService.isAccessTokenValid(jwt, user)) {
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        user,
                        null,
                        user.getAuthorities()
                    );
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
                // An invalid token leaves the request anonymous: Spring answers 401 if the route needs auth
            } catch (JwtException | IllegalArgumentException | UsernameNotFoundException e) {
                logger.debug("JWT authentication failed: " + e.getMessage());
            }
        }

        filterChain.doFilter(request, response);
    }
}
