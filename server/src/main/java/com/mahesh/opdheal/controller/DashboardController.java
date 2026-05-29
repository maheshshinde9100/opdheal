package com.mahesh.opdheal.controller;

import com.mahesh.opdheal.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getStats() {
        return ResponseEntity.ok(dashboardService.getStats());
    }

    @GetMapping("/doctor/{doctorId}/stats")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR')")
    public ResponseEntity<Map<String, Object>> getDoctorStats(@PathVariable String doctorId) {
        return ResponseEntity.ok(dashboardService.getDoctorStats(doctorId));
    }

    @GetMapping("/patient/{patientId}/stats")
    @PreAuthorize("hasRole('ADMIN') or hasRole('PATIENT')")
    public ResponseEntity<Map<String, Object>> getPatientStats(@PathVariable String patientId) {
        return ResponseEntity.ok(dashboardService.getPatientStats(patientId));
    }
}
