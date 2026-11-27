package com.avernet.myworkoutapi.auth;

import com.avernet.myworkoutapi.config.BCryptConfig;
import com.avernet.myworkoutapi.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

@Configuration
@RequiredArgsConstructor
public class AuthenticationConfig {

    private final UserRepository userRepository;
    private final BCryptConfig bCryptConfig;


    // Must throw UsernameNotFoundException specifically (not a business exception): that is the
    // only one DaoAuthenticationProvider turns into a generic BadCredentialsException while still
    // hashing a dummy password, so an unknown email can't be told apart from a wrong password
    // (by the error or by the response time).
    @Bean
    UserDetailsService userDetailsService() {
        return username -> userRepository.findByEmail(username)
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) {
        return config.getAuthenticationManager();
    }

    @Bean
    AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider(userDetailsService());
        authProvider.setPasswordEncoder(bCryptConfig.passwordEncoder());

        return authProvider;
    }
}
