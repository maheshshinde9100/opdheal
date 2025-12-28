package com.mahesh.opdheal.model;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Document(collection = "bills")
public class Bill {
    @Id
    private String id;

    @NotBlank(message = "Patient ID is mandatory")
    private String patientId;

    @NotBlank(message = "Appointment ID is mandatory")
    private String appointmentId;

    @NotNull(message = "Consultation fee is mandatory")
    @DecimalMin(value = "0.0", inclusive = false, message = "Consultation fee must be positive")
    private BigDecimal consultationFee;

    @NotNull(message = "Medicine fee is mandatory")
    @DecimalMin(value = "0.0", inclusive = false, message = "Medicine fee must be positive")
    private BigDecimal medicineFee;

    @NotNull(message = "Total amount is mandatory")
    @DecimalMin(value = "0.0", inclusive = false, message = "Total amount must be positive")
    private BigDecimal totalAmount;

    @NotNull(message = "Bill status is mandatory")
    private Status status;

    private LocalDateTime billDate;
    private LocalDateTime paymentDate;
    private List<String> items; // Description of items billed

    public enum Status {
        PENDING, PAID, OVERDUE
    }
}