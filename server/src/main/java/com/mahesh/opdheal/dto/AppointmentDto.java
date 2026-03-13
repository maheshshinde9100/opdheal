package com.mahesh.opdheal.dto;

import com.mahesh.opdheal.model.Appointment;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class AppointmentDto {
    private String id;
    private String patientId;
    private String patientName;
    private String doctorId;
    private String doctorName;
    private String doctorSpecialization;
    private LocalDateTime appointmentDateTime;
    private String reason;
    private Appointment.Status status;
    private String notes;
}
