package com.mahesh.opdheal.controller;

import com.mahesh.opdheal.dto.PaymentRequestDto;
import com.mahesh.opdheal.dto.PaymentResponseDto;
import com.mahesh.opdheal.service.RazorpayService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@Slf4j
@CrossOrigin(origins = "http://localhost:5173")
public class PaymentController {

    private final RazorpayService razorpayService;

    public PaymentController(RazorpayService razorpayService) {
        this.razorpayService = razorpayService;
    }

    @PostMapping("/create-order")
    @PreAuthorize("hasRole('PATIENT') or hasRole('ADMIN')")
    public ResponseEntity<PaymentResponseDto> createPaymentOrder(@Valid @RequestBody PaymentRequestDto request) {
        try {
            log.info("Creating payment order for amount: {}", request.getAmount());
            PaymentResponseDto response = razorpayService.createOrder(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Failed to create payment order", e);
            return ResponseEntity.internalServerError().build();
        }
    }
}
