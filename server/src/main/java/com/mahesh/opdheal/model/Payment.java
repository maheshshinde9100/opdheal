package com.mahesh.opdheal.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Document(collection = "payments")
public class Payment {
    @Id
    private String id;

    private String orderId;
    private String razorpayPaymentId;
    private String razorpayOrderId;
    private String razorpaySignature;
    private String patientId;
    private String appointmentId;
    private BigDecimal amount;
    private String currency;
    private String status; // CREATED, PAID, FAILED, REFUNDED
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
