package com.mahesh.opdheal.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@Document(collection = "doctors")
public class Doctor {
    @Id
    private String id;
    private String userId; // Reference to User
    private String specialization;
    private String licenseNumber;
    private String phoneNumber;
    private List<String> qualifications;
    private int experienceYears;
    private String department;
    private boolean available = true;
}