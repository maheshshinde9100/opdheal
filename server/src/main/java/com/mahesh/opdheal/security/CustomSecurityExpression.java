package com.mahesh.opdheal.security;

import com.mahesh.opdheal.repository.DoctorRepository;
import com.mahesh.opdheal.repository.PatientRepository;
import com.mahesh.opdheal.repository.UserRepository;
import com.mahesh.opdheal.service.DoctorService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

@Component("customSecurityExpression")
public class CustomSecurityExpression {

    private final DoctorService doctorService;
    private final UserRepository userRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;

    public CustomSecurityExpression(DoctorService doctorService,
                                    UserRepository userRepository,
                                    PatientRepository patientRepository,
                                    DoctorRepository doctorRepository) {
        this.doctorService = doctorService;
        this.userRepository = userRepository;
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
    }

    public boolean isDoctor(Authentication authentication) {
        return authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_DOCTOR"));
    }

    public boolean isPatient(Authentication authentication) {
        return authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_PATIENT"));
    }

    /**
     * Checks whether the authenticated user owns the profile with the given profileId.
     * Works for both patient and doctor profiles by resolving the username -> userId -> profileId chain.
     */
    public boolean hasUserId(Authentication authentication, String profileId) {
        if (authentication == null || !(authentication.getPrincipal() instanceof UserDetails)) {
            return false;
        }
        String username = ((UserDetails) authentication.getPrincipal()).getUsername();
        return userRepository.findByUsername(username)
                .map(user -> {
                    // Check if this user owns a patient profile with the given id
                    boolean isOwnPatient = patientRepository.findByUserId(user.getId())
                            .map(p -> p.getId().equals(profileId))
                            .orElse(false);
                    // Check if this user owns a doctor profile with the given id
                    boolean isOwnDoctor = doctorRepository.findByUserId(user.getId())
                            .map(d -> d.getId().equals(profileId))
                            .orElse(false);
                    return isOwnPatient || isOwnDoctor;
                })
                .orElse(false);
    }
}
