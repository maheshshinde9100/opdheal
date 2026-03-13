package com.mahesh.opdheal.controller;

import com.mahesh.opdheal.model.MedicalRecord;
import com.mahesh.opdheal.service.MedicalRecordService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/medical-records")
public class MedicalRecordController {

    @Autowired
    private MedicalRecordService medicalRecordService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR')")
    public ResponseEntity<MedicalRecord> createMedicalRecord(@Valid @RequestBody MedicalRecord medicalRecord) {
        return ResponseEntity.ok(medicalRecordService.createMedicalRecord(medicalRecord));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR')")
    public ResponseEntity<List<MedicalRecord>> getAllMedicalRecords() {
        return ResponseEntity.ok(medicalRecordService.getAllMedicalRecords());
    }

    @GetMapping("/patient/{patientId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('PATIENT')")
    public ResponseEntity<List<MedicalRecord>> getMedicalRecordsByPatient(@PathVariable String patientId) {
        return ResponseEntity.ok(medicalRecordService.getMedicalRecordsByPatient(patientId));
    }

    @GetMapping("/doctor/{doctorId}")
    @PreAuthorize("hasRole('ADMIN') or @customSecurityExpression.hasUserId(authentication, #doctorId)")
    public ResponseEntity<List<MedicalRecord>> getMedicalRecordsByDoctor(@PathVariable String doctorId) {
        return ResponseEntity.ok(medicalRecordService.getMedicalRecordsByDoctor(doctorId));
    }

    @GetMapping("/appointment/{appointmentId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR')")
    public ResponseEntity<List<MedicalRecord>> getMedicalRecordsByAppointment(@PathVariable String appointmentId) {
        return ResponseEntity.ok(medicalRecordService.getMedicalRecordsByAppointment(appointmentId));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR')")
    public ResponseEntity<MedicalRecord> getMedicalRecordById(@PathVariable String id) {
        return medicalRecordService.getMedicalRecordById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR')")
    public ResponseEntity<MedicalRecord> updateMedicalRecord(@PathVariable String id, @Valid @RequestBody MedicalRecord medicalRecord) {
        return ResponseEntity.ok(medicalRecordService.updateMedicalRecord(id, medicalRecord));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteMedicalRecord(@PathVariable String id) {
        medicalRecordService.deleteMedicalRecord(id);
        return ResponseEntity.noContent().build();
    }
}