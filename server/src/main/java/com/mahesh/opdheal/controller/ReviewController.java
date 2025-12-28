package com.mahesh.opdheal.controller;

import com.mahesh.opdheal.model.Review;
import com.mahesh.opdheal.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @PostMapping
    public ResponseEntity<Review> createReview(@RequestBody Review review) {
        return ResponseEntity.ok(reviewService.createReview(review));
    }

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<Review>> getReviewsForDoctor(@PathVariable String doctorId) {
        return ResponseEntity.ok(reviewService.getReviewsForDoctor(doctorId));
    }
}
