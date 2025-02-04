package com.project.academia_hub.controller;

import com.project.academia_hub.model.User;
import com.project.academia_hub.service.EmailService;
import com.project.academia_hub.service.LogService;
import com.project.academia_hub.service.UserService;
import com.project.academia_hub.util.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private final UserService userService;
    private final EmailService emailService;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;
    private final LogService logService;

    public UserController(UserService userService, EmailService emailService, JwtUtil jwtUtil, PasswordEncoder passwordEncoder, LogService logService) {
        this.userService = userService;
        this.emailService = emailService;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
        this.logService = logService;
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@Valid @RequestBody User user) {
        try {
            userService.signup(user);
            emailService.sendWelcomeEmail(
                    user.getEmail(),
                    "Welcome to Academia Hub",
                    "Hello " + user.getUsername() + ",\n\nThank you for signing up to Academia Hub!"
            );
            logService.logAction(user.getUsername(), "User Signup", "User successfully registered", LocalDateTime.now());
            return ResponseEntity.status(HttpStatus.CREATED).body(user);
        } catch (Exception e) {
            logService.logAction(user.getUsername(), "User Signup Failed", "User already exists", LocalDateTime.now());
            return ResponseEntity.badRequest().body(Map.of("error", "User already exists"));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        User existingUser = userService.findByUsername(user.getUsername());
        if (existingUser == null || !passwordEncoder.matches(user.getPassword(), existingUser.getPassword())) {
            logService.logAction(user.getUsername(), "Login Failed", "Invalid credentials", LocalDateTime.now());
            return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"));
        }
        String token = jwtUtil.createToken(existingUser.getUsername());
        logService.logAction(existingUser.getUsername(), "User Login", "Login successful", LocalDateTime.now());
        return ResponseEntity.ok(Map.of(
                "token", token,
                "role", existingUser.getRole()
        ));
    }

    @GetMapping("/user/{username}")
    public ResponseEntity<?> getUserByUsername(@PathVariable String username) {
        User user = userService.findByUsername(username);
        if (user == null) {
            return ResponseEntity.status(404).body(Map.of("error", "User not found"));
        }
        return ResponseEntity.ok(user);
    }
}
