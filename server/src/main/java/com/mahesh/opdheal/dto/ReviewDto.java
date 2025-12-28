package com.mahesh.opdheal.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ReviewDto {
    private String id;
    private String doctorId;
    private String patientId;
    private int rating;
    private String comment;
    private LocalDateTime createdAt;
}
