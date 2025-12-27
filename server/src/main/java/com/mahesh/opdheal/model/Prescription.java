package com.mahesh.opdheal.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Document(collection = "prescriptions")
public class Prescription {
    @Id
    private String id;
    private String patientId;
    private String doctorId;
    private String appointmentId;
    private LocalDateTime prescriptionDate;
    private List<Medicine> medicines;
    private String instructions;
    private String notes;

    @Data
    public static class Medicine {
        private String name;
        private String dosage;
        private String frequency;
        private int durationDays;
    }
}