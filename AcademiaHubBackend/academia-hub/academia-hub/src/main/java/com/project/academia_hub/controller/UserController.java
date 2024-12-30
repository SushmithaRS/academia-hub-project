package com.project.academia_hub.controller;

import com.project.academia_hub.model.User;
import com.project.academia_hub.service.EmailService;
import com.project.academia_hub.service.UserService;
import com.project.academia_hub.util.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private final UserService userService;
    private final EmailService emailService;
    private final JwtUtil jwtUtil;

    public UserController(UserService userService, EmailService emailService, JwtUtil jwtUtil) {
        this.userService = userService;
        this.emailService = emailService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody User user) {
        userService.signup(user);
        emailService.sendWelcomeEmail(
                user.getEmail(),  // Assuming username is the email
                "Welcome to Academia Hub",
                "Hello " + user.getUsername()+ ",\n\nThank you for signing up to Academia Hub!"
        );
        return ResponseEntity.ok("User registered successfully!");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        User existingUser = userService.findByUsername(user.getUsername());
        if (existingUser == null || !new BCryptPasswordEncoder().matches(user.getPassword(), existingUser.getPassword())) {
            return ResponseEntity.status(401).body("Invalid credentials");
        }
        String token = jwtUtil.createToken(existingUser.getUsername());
        return ResponseEntity.ok(token);
    }
}
