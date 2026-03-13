package com.mahesh.opdheal.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.util.List;

@Data
@Document(collection = "patients")
public class Patient {
    @Id
    private String id;

    @NotBlank(message = "User ID is mandatory")
    private String userId;

    @NotBlank(message = "Phone number is mandatory")
    private String phoneNumber;

    @NotNull(message = "Date of birth is mandatory")
    private LocalDate dateOfBirth;

    private String gender;
    private String address;
    private String emergencyContact;
    private List<String> allergies;
    private String bloodGroup;
    private String weight;
    private String medicalHistory;
}