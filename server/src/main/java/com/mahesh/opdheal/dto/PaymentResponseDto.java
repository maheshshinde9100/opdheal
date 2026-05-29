package com.mahesh.opdheal.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentResponseDto {
    private String orderId;
    private String currency;
    private Long amount;
    private String razorpayKeyId;
}
