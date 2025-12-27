package com.mahesh.opdheal.model;

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
    private String patientId;
    private String appointmentId;
    private BigDecimal consultationFee;
    private BigDecimal medicineFee;
    private BigDecimal totalAmount;
    private Status status;
    private LocalDateTime billDate;
    private LocalDateTime paymentDate;
    private List<String> items; // Description of items billed

    public enum Status {
        PENDING, PAID, OVERDUE
    }
}