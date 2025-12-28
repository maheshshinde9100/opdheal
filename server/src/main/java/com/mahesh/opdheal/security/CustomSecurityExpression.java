package com.mahesh.opdheal.security;

import com.mahesh.opdheal.model.User;
import com.mahesh.opdheal.service.DoctorService;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

@Component("customSecurityExpression")
public class CustomSecurityExpression {

    private final DoctorService doctorService;

    public CustomSecurityExpression(DoctorService doctorService) {
        this.doctorService = doctorService;
    }

    public boolean isDoctor(Authentication authentication) {
        // Implement logic to check if the user is a doctor
        // This might involve checking roles or authorities
        return authentication.getAuthorities().stream()
                .anyMatch(grantedAuthority -> grantedAuthority.getAuthority().equals("ROLE_DOCTOR"));
    }

    public boolean isPatient(Authentication authentication) {
        // Implement logic to check if the user is a patient
        return authentication.getAuthorities().stream()
                .anyMatch(grantedAuthority -> grantedAuthority.getAuthority().equals("ROLE_PATIENT"));
    }

    public boolean hasUserId(Authentication authentication, String userId) {
        if (authentication.getPrincipal() instanceof User) {
            User user = (User) authentication.getPrincipal();
            return user.getId().equals(userId);
        }
        return false;
    }
}
