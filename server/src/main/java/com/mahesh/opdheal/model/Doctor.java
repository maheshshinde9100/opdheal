package com.mahesh.opdheal.model;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@Document(collection = "doctors")
public class Doctor {
    @Id
    private String id;

    @NotBlank(message = "User ID is mandatory")
    private String userId;

    @NotBlank(message = "Specialization is mandatory")
    private String specialization;

    @NotBlank(message = "License number is mandatory")
    private String licenseNumber;

    @NotBlank(message = "Phone number is mandatory")
    private String phoneNumber;

    private List<String> qualifications;

    @Min(value = 0, message = "Experience years cannot be negative")
    private int experienceYears;

    private String department;
    private boolean available = true;
}