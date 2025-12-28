package com.mahesh.opdheal.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Document(collection = "appointments")
public class Appointment {
    @Id
    private String id;

    @NotBlank(message = "Patient ID is mandatory")
    private String patientId;

    @NotBlank(message = "Doctor ID is mandatory")
    private String doctorId;

    @NotNull(message = "Appointment date and time is mandatory")
    private LocalDateTime appointmentDateTime;

    @NotBlank(message = "Reason for appointment is mandatory")
    private String reason;

    @NotNull(message = "Appointment status is mandatory")
    private Status status;

    private String notes;
    private LocalDateTime createdAt;

    public enum Status {
        SCHEDULED, CONFIRMED, IN_PROGRESS, COMPLETED, CANCELLED
    }
}