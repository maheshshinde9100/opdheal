package com.mahesh.opdheal.dto;

import com.mahesh.opdheal.model.Prescription;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class PrescriptionDto {
    private String id;
    private String patientId;
    private String patientName;
    private String doctorId;
    private String doctorName;
    private String doctorSpecialization;
    private String appointmentId;
    private LocalDateTime prescriptionDate;
    private List<Prescription.Medicine> medicines;
    private String instructions;
    private String notes;
}
