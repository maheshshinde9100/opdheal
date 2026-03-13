package com.mahesh.opdheal.dto;

import lombok.Data;
import java.util.List;

@Data
public class DoctorDto {
    private String id;
    private String userId;
    private String firstName;
    private String lastName;
    private String email;
    private String specialization;
    private String licenseNumber;
    private String phoneNumber;
    private List<String> qualifications;
    private int experienceYears;
    private String department;
    private boolean available;
    private double averageRating;
    private int ratingCount;
}
