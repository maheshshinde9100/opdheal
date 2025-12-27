package com.mahesh.opdheal.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Document(collection = "medical_records")
public class MedicalRecord {
    @Id
    private String id;
    private String patientId;
    private String doctorId;
    private String appointmentId;
    private LocalDateTime recordDate;
    private String diagnosis;
    private String symptoms;
    private String treatment;
    private List<String> prescribedMedicines; // Simple list, can expand later
    private String notes;
}