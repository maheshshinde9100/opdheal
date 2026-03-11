package com.mahesh.opdheal.dto;

import lombok.Data;

@Data
public class AuthResponse {
    private String token;
    private String type = "Bearer";
    private String username;
    private String role;
    private String profileId;

    public AuthResponse(String token, String username, String role, String profileId) {
        this.token = token;
        this.username = username;
        this.role = role;
        this.profileId = profileId;
    }
}