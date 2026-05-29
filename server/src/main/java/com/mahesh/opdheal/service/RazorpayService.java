package com.mahesh.opdheal.service;

import com.mahesh.opdheal.dto.PaymentRequestDto;
import com.mahesh.opdheal.dto.PaymentResponseDto;
import com.mahesh.opdheal.model.Payment;
import com.mahesh.opdheal.repository.PaymentRepository;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;

@Service
@Slf4j
public class RazorpayService {

    @Value("${razorpay.key.id}")
    private String razorpayKeyId;

    @Value("${razorpay.key.secret}")
    private String razorpayKeySecret;

    @Value("${razorpay.currency:INR}")
    private String currency;

    private final PaymentRepository paymentRepository;

    public RazorpayService(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    public PaymentResponseDto createOrder(PaymentRequestDto request) throws RazorpayException {
        RazorpayClient razorpayClient = new RazorpayClient(razorpayKeyId, razorpayKeySecret);

        // Amount in paise (INR)
        Long amountInPaise = request.getAmount()
                .multiply(new BigDecimal("100"))
                .setScale(0, RoundingMode.DOWN)
                .longValue();

        JSONObject orderRequest = new JSONObject();
        orderRequest.put("amount", amountInPaise);
        orderRequest.put("currency", currency);
        orderRequest.put("receipt", "receipt_" + System.currentTimeMillis());
        orderRequest.put("payment_capture", 1); // Auto capture

        Order order = razorpayClient.orders.create(orderRequest);

        // Save payment record
        Payment payment = new Payment();
        payment.setOrderId("payment_" + System.currentTimeMillis());
        payment.setRazorpayOrderId(order.get("id"));
        payment.setPatientId(request.getPatientId());
        payment.setAppointmentId(request.getAppointmentId());
        payment.setAmount(request.getAmount());
        payment.setCurrency(currency);
        payment.setStatus("CREATED");
        payment.setCreatedAt(LocalDateTime.now());
        payment.setUpdatedAt(LocalDateTime.now());
        paymentRepository.save(payment);

        PaymentResponseDto response = new PaymentResponseDto();
        response.setOrderId(order.get("id"));
        response.setCurrency(currency);
        response.setAmount(amountInPaise);
        response.setRazorpayKeyId(razorpayKeyId);

        log.info("Created Razorpay order: {}", response.getOrderId());

        return response;
    }
}
