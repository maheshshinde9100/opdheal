package com.mahesh.opdheal.dto;

import com.mahesh.opdheal.model.User;
import lombok.Data;

@Data
public class RegisterRequest {
    private String username;
    private String password;
    private String email;
    private String firstName;
    private String lastName;
    private User.Role role;
}