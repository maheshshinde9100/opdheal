package com.mahesh.opdheal.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Data
@Document(collection = "reviews")
public class Review {
    @Id
    private String id;
    private String doctorId;
    private String patientId;
    private int rating; // e.g., 1 to 5
    private String comment;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
