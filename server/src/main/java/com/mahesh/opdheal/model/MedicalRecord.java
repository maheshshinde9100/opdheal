package com.mahesh.opdheal.model;

import jakarta.validation.constraints.NotBlank;
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

    @NotBlank(message = "Patient ID is mandatory")
    private String patientId;

    @NotBlank(message = "Doctor ID is mandatory")
    private String doctorId;

    private String appointmentId;
    private LocalDateTime recordDate;

    @NotBlank(message = "Diagnosis is mandatory")
    private String diagnosis;

    @NotBlank(message = "Symptoms are mandatory")
    private String symptoms;

    private String treatment;
    private List<String> prescribedMedicines;
    private String notes;
}