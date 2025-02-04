package com.project.academia_hub.config;

import com.project.academia_hub.security.JwtAuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import com.project.academia_hub.service.UserService;
import com.project.academia_hub.util.JwtUtil;

@Configuration
public class SecurityConfig {

    private final JwtUtil jwtUtil;
    private final UserService userService;

    public SecurityConfig(JwtUtil jwtUtil, UserService userService) {
        this.jwtUtil = jwtUtil;
        this.userService = userService;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(AbstractHttpConfigurer::disable) // Disable CSRF for development
                .cors(cors -> {}) // Enable CORS with a default configuration
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(new AntPathRequestMatcher("/api/documents/**")).authenticated()
                        .requestMatchers(new AntPathRequestMatcher("/api/students/**")).authenticated()
                        .requestMatchers(new AntPathRequestMatcher("/api/auth/**")).permitAll()
                        .requestMatchers(new AntPathRequestMatcher("/api/auth/user/**")).permitAll()// Allow access to auth endpoints
                        .requestMatchers(new AntPathRequestMatcher("/api/students/with-documents/**")).authenticated()
                        .requestMatchers(new AntPathRequestMatcher("/uploads/**")).authenticated()
                        .anyRequest().authenticated() // Secure other endpoints
                )
                .addFilterBefore(new JwtAuthenticationFilter(jwtUtil, userService),
                        UsernamePasswordAuthenticationFilter.class) // Add JWT filter to secure endpoints
                .build();
    }
}
