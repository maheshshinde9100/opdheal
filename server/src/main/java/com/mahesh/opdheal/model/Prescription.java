package com.mahesh.opdheal.model;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
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

    @NotBlank(message = "Patient ID is mandatory")
    private String patientId;

    @NotBlank(message = "Doctor ID is mandatory")
    private String doctorId;

    @NotBlank(message = "Appointment ID is mandatory")
    private String appointmentId;

    @NotNull(message = "Prescription date is mandatory")
    private LocalDateTime prescriptionDate;

    @Valid
    @Size(min = 1, message = "At least one medicine must be prescribed")
    private List<Medicine> medicines;

    @NotBlank(message = "Instructions are mandatory")
    private String instructions;

    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Data
    public static class Medicine {
        @NotBlank(message = "Medicine name is mandatory")
        private String name;
        @NotBlank(message = "Dosage is mandatory")
        private String dosage;
        @NotBlank(message = "Frequency is mandatory")
        private String frequency;
        @NotNull(message = "Duration in days is mandatory")
        private int durationDays;
    }
}