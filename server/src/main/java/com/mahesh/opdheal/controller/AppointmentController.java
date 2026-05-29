package com.mahesh.opdheal.controller;

import com.mahesh.opdheal.dto.AppointmentDto;
import com.mahesh.opdheal.model.Appointment;
import com.mahesh.opdheal.service.AppointmentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('PATIENT')")
    public ResponseEntity<Appointment> createAppointment(@Valid @RequestBody Appointment appointment) {
        return ResponseEntity.ok(appointmentService.createAppointment(appointment));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR')")
    public ResponseEntity<List<AppointmentDto>> getAllAppointments() {
        return ResponseEntity.ok(appointmentService.getAllAppointments());
    }

    @GetMapping("/patient/{patientId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('PATIENT')")
    public ResponseEntity<List<AppointmentDto>> getAppointmentsByPatient(@PathVariable String patientId) {
        return ResponseEntity.ok(appointmentService.getAppointmentsByPatient(patientId));
    }

    @GetMapping("/doctor/{doctorId}")
    @PreAuthorize("hasRole('ADMIN') or @customSecurityExpression.hasUserId(authentication, #doctorId)")
    public ResponseEntity<List<AppointmentDto>> getAppointmentsByDoctor(@PathVariable String doctorId) {
        return ResponseEntity.ok(appointmentService.getAppointmentsByDoctor(doctorId));
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR')")
    public ResponseEntity<List<AppointmentDto>> getAppointmentsByStatus(@PathVariable Appointment.Status status) {
        return ResponseEntity.ok(appointmentService.getAppointmentsByStatus(status));
    }

    @GetMapping("/daterange")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR')")
    public ResponseEntity<List<AppointmentDto>> getAppointmentsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        return ResponseEntity.ok(appointmentService.getAppointmentsByDateRange(start, end));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('PATIENT')")
    public ResponseEntity<AppointmentDto> getAppointmentById(@PathVariable String id) {
        return appointmentService.getAppointmentDtoById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('PATIENT')")
    public ResponseEntity<Appointment> updateAppointment(@PathVariable String id, @Valid @RequestBody Appointment appointment) {
        return ResponseEntity.ok(appointmentService.updateAppointment(id, appointment));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteAppointment(@PathVariable String id) {
        appointmentService.deleteAppointment(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/complete")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR')")
    public ResponseEntity<AppointmentDto> markAsCompleted(@PathVariable String id) {
        Appointment appointment = appointmentService.markAsCompleted(id);
        return ResponseEntity.ok(appointmentService.toDto(appointment));
    }

    @PutMapping("/{id}/cancel")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('PATIENT')")
    public ResponseEntity<AppointmentDto> markAsCancelled(@PathVariable String id) {
        Appointment appointment = appointmentService.markAsCancelled(id);
        return ResponseEntity.ok(appointmentService.toDto(appointment));
    }

    @PutMapping("/{id}/no-show")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR')")
    public ResponseEntity<AppointmentDto> markAsNoShow(@PathVariable String id) {
        Appointment appointment = appointmentService.markAsNoShow(id);
        return ResponseEntity.ok(appointmentService.toDto(appointment));
    }

    @PutMapping("/{id}/confirm")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR') or hasRole('PATIENT')")
    public ResponseEntity<AppointmentDto> markAsConfirmed(@PathVariable String id) {
        Appointment appointment = appointmentService.markAsConfirmed(id);
        return ResponseEntity.ok(appointmentService.toDto(appointment));
    }

    @PutMapping("/{id}/in-progress")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DOCTOR')")
    public ResponseEntity<AppointmentDto> markAsInProgress(@PathVariable String id) {
        Appointment appointment = appointmentService.markAsInProgress(id);
        return ResponseEntity.ok(appointmentService.toDto(appointment));
    }
}