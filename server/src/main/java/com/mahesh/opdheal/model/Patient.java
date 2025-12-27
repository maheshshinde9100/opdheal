package com.mahesh.opdheal.model;

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
    private String userId; // Reference to User
    private String phoneNumber;
    private LocalDate dateOfBirth;
    private String gender;
    private String address;
    private String emergencyContact;
    private List<String> allergies;
    private String bloodGroup;
    private String medicalHistory; // Could be a list or detailed object later
}