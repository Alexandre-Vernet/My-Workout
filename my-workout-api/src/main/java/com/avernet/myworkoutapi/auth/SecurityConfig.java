package com.avernet.myworkoutapi.auth;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;

/**
 * Single source of truth for route access. Anything not listed falls under
 * {@code anyRequest().authenticated()}, which only requires a logged-in user: an admin-only
 * route MUST be declared here with {@code hasAuthority(ROLE_ADMIN)}, and covered by
 * SecurityConfigTest.
 * Path variables are constrained ({@code \d+}) so a public "/exercises/{id}" pattern can never
 * swallow a sibling route like "/exercises/description".
 */
@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    public static final String ROLE_ADMIN = "ROLE_ADMIN";

    private final AuthenticationProvider authenticationProvider;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final CorsConfigurationSource corsConfigurationSource;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) {
        return http
            .cors(cors -> cors.configurationSource(corsConfigurationSource))
            .csrf(AbstractHttpConfigurer::disable)
            .authorizeHttpRequests(auth ->
                auth
                    .requestMatchers(HttpMethod.GET, "/").permitAll()
                    .requestMatchers(HttpMethod.HEAD, "/").permitAll()
                    .requestMatchers(HttpMethod.POST, "/auth/login", "/auth/register", "/auth/refresh").permitAll()
                    .requestMatchers(HttpMethod.GET,
                        "/exercises",
                        "/exercises/search",
                        "/exercises/{exerciseId:\\d+}",
                        "/exercises/muscle-group/{muscleGroupId:\\d+}",
                        "/muscle-group").permitAll()
                    .requestMatchers(HttpMethod.GET, "/exercises/description").hasAuthority(ROLE_ADMIN)
                    .requestMatchers(HttpMethod.POST, "/exercises").hasAuthority(ROLE_ADMIN)
                    .requestMatchers(HttpMethod.GET, "/password-reset-token/forgot-password", "/password-reset-token/valid").permitAll()
                    .requestMatchers(HttpMethod.POST, "/password-reset-token/reset-password").permitAll()
                    .requestMatchers("/error").permitAll()
                    .anyRequest().authenticated())
            .exceptionHandling(exceptions -> exceptions
                .authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED)))
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .authenticationProvider(authenticationProvider)
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
            .build();
    }
}
