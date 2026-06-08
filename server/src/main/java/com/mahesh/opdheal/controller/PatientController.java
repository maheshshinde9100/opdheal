package com.mahesh.opdheal.controller;

import com.mahesh.opdheal.dto.PatientDto;
import com.mahesh.opdheal.dto.PatientHistoryDto;
import com.mahesh.opdheal.model.Patient;
import com.mahesh.opdheal.service.PatientService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/patients")
public class PatientController {

    @Autowired
    private PatientService patientService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR')")
    public ResponseEntity<Patient> createPatient(@Valid @RequestBody Patient patient) {
        return ResponseEntity.ok(patientService.createPatient(patient));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR')")
    public ResponseEntity<List<PatientDto>> getAllPatients() {
        return ResponseEntity.ok(patientService.getAllPatients());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or @customSecurityExpression.hasUserId(authentication, #id)")
    public ResponseEntity<PatientDto> getPatientById(@PathVariable String id) {
        return patientService.getPatientById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or @customSecurityExpression.hasUserId(authentication, #id)")
    public ResponseEntity<Patient> updatePatient(@PathVariable String id, @Valid @RequestBody Patient patient) {
        return ResponseEntity.ok(patientService.updatePatient(id, patient));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deletePatient(@PathVariable String id) {
        patientService.deletePatient(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/history")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or @customSecurityExpression.hasUserId(authentication, #id)")
    public ResponseEntity<PatientHistoryDto> getPatientHistory(@PathVariable String id) {
        return ResponseEntity.ok(patientService.getPatientHistory(id));
    }

    @GetMapping("/doctor/{doctorId}")
    @PreAuthorize("hasRole('ADMIN') or @customSecurityExpression.hasUserId(authentication, #doctorId)")
    public ResponseEntity<List<PatientDto>> getPatientsByDoctor(@PathVariable String doctorId) {
        return ResponseEntity.ok(patientService.getPatientsByDoctor(doctorId));
    }
}