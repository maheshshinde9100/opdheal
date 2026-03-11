package com.mahesh.opdheal.controller;

import com.mahesh.opdheal.dto.AuthRequest;
import com.mahesh.opdheal.dto.AuthResponse;
import com.mahesh.opdheal.dto.RegisterRequest;
import com.mahesh.opdheal.model.User;
import com.mahesh.opdheal.repository.DoctorRepository;
import com.mahesh.opdheal.repository.PatientRepository;
import com.mahesh.opdheal.service.UserService;
import com.mahesh.opdheal.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserService userService;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest authRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(authRequest.getUsername(), authRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtil.generateToken(authentication);

        User user = userService.findByUsername(authRequest.getUsername()).orElseThrow();
        
        String profileId = null;
        if (user.getRole() == User.Role.PATIENT) {
            profileId = patientRepository.findByUserId(user.getId())
                    .map(com.mahesh.opdheal.model.Patient::getId).orElse(null);
        } else if (user.getRole() == User.Role.DOCTOR) {
            profileId = doctorRepository.findByUserId(user.getId())
                    .map(com.mahesh.opdheal.model.Doctor::getId).orElse(null);
        }

        return ResponseEntity.ok(new AuthResponse(jwt, user.getUsername(), user.getRole().name(), profileId));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest registerRequest) {
        User user = new User();
        user.setUsername(registerRequest.getUsername());
        user.setPassword(registerRequest.getPassword());
        user.setEmail(registerRequest.getEmail());
        user.setFirstName(registerRequest.getFirstName());
        user.setLastName(registerRequest.getLastName());
        user.setRole(registerRequest.getRole());

        User savedUser = userService.registerUser(user);
        return ResponseEntity.ok(savedUser);
    }
}