package com.mahesh.opdheal.service;

import com.mahesh.opdheal.model.Doctor;
import com.mahesh.opdheal.model.Review;
import com.mahesh.opdheal.repository.DoctorRepository;
import com.mahesh.opdheal.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    public List<Review> getReviewsForDoctor(String doctorId) {
        return reviewRepository.findByDoctorId(doctorId);
    }

    @Transactional
    public Review createReview(Review review) {
        review.setCreatedAt(LocalDateTime.now());
        Review savedReview = reviewRepository.save(review);
        updateDoctorRating(review.getDoctorId());
        return savedReview;
    }

    private void updateDoctorRating(String doctorId) {
        List<Review> reviews = reviewRepository.findByDoctorId(doctorId);
        if (reviews.isEmpty()) {
            return;
        }

        double averageRating = reviews.stream()
                .mapToInt(Review::getRating)
                .average()
                .orElse(0.0);

        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found")); // Or a more specific exception

        doctor.setAverageRating(averageRating);
        doctor.setRatingCount(reviews.size());
        doctorRepository.save(doctor);
    }
}
