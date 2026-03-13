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
        try {
            User user = new User();
            user.setUsername(registerRequest.getUsername());
            user.setPassword(registerRequest.getPassword());
            user.setEmail(registerRequest.getEmail());
            user.setFirstName(registerRequest.getFirstName());
            user.setLastName(registerRequest.getLastName());
            user.setRole(registerRequest.getRole());

            User savedUser = userService.registerUser(user);

            // Create Profile based on Role
            if (savedUser.getRole() == User.Role.PATIENT) {
                com.mahesh.opdheal.model.Patient patient = new com.mahesh.opdheal.model.Patient();
                patient.setUserId(savedUser.getId());
                patient.setPhoneNumber("Update required"); // Default placeholder
                patient.setDateOfBirth(java.time.LocalDate.now()); // Default placeholder
                patientRepository.save(patient);
            } else if (savedUser.getRole() == User.Role.DOCTOR) {
                com.mahesh.opdheal.model.Doctor doctor = new com.mahesh.opdheal.model.Doctor();
                doctor.setUserId(savedUser.getId());
                doctor.setSpecialization("Update required");
                doctor.setPhoneNumber("Update required");
                doctor.setLicenseNumber("TEMP-" + java.util.UUID.randomUUID().toString().substring(0, 8));
                doctorRepository.save(doctor);
            }

            return ResponseEntity.ok(savedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}