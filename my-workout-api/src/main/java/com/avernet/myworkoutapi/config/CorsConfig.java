package com.avernet.myworkoutapi.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class CorsConfig {

    @Value("${allowed.origin}")
    private String allowedOrigin;

    // Exposed as a CorsConfigurationSource bean (not a WebMvcConfigurer) so SecurityConfig's
    // cors() can use it: a WebMvcConfigurer-based registration only runs for requests that reach
    // a dispatched controller, so a request rejected earlier by the security filter chain (e.g. an
    // expired JWT, answered with 401 before any controller runs) got no
    // Access-Control-Allow-Origin header, and the browser blocked the response as a CORS failure
    // instead of letting the app see the real 401 and refresh the token.
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of(allowedOrigin));
        configuration.setAllowedMethods(List.of("GET", "POST", "PATCH", "DELETE", "OPTIONS", "HEAD"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
