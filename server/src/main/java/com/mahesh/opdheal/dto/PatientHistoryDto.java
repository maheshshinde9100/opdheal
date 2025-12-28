package com.mahesh.opdheal.dto;

import com.mahesh.opdheal.model.Appointment;
import com.mahesh.opdheal.model.MedicalRecord;
import com.mahesh.opdheal.model.Prescription;
import lombok.Data;

import java.util.List;

@Data
public class PatientHistoryDto {
    private PatientDto patient;
    private List<Appointment> appointments;
    private List<Prescription> prescriptions;
    private List<MedicalRecord> medicalRecords;
}
