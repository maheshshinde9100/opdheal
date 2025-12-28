package com.mahesh.opdheal.service;

import com.mahesh.opdheal.exception.ResourceNotFoundException;
import com.mahesh.opdheal.model.MedicalRecord;
import com.mahesh.opdheal.repository.MedicalRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class MedicalRecordService {

    @Autowired
    private MedicalRecordRepository medicalRecordRepository;

    public MedicalRecord createMedicalRecord(MedicalRecord medicalRecord) {
        medicalRecord.setRecordDate(LocalDateTime.now());
        return medicalRecordRepository.save(medicalRecord);
    }

    public List<MedicalRecord> getAllMedicalRecords() {
        return medicalRecordRepository.findAll();
    }

    public Optional<MedicalRecord> getMedicalRecordById(String id) {
        return medicalRecordRepository.findById(id);
    }

    public List<MedicalRecord> getMedicalRecordsByPatient(String patientId) {
        return medicalRecordRepository.findByPatientId(patientId);
    }

    public List<MedicalRecord> getMedicalRecordsByDoctor(String doctorId) {
        return medicalRecordRepository.findByDoctorId(doctorId);
    }

    public List<MedicalRecord> getMedicalRecordsByAppointment(String appointmentId) {
        return medicalRecordRepository.findByAppointmentId(appointmentId);
    }

    public MedicalRecord updateMedicalRecord(String id, MedicalRecord recordDetails) {
        MedicalRecord record = medicalRecordRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Medical record not found with id: " + id));

        record.setPatientId(recordDetails.getPatientId());
        record.setDoctorId(recordDetails.getDoctorId());
        record.setAppointmentId(recordDetails.getAppointmentId());
        record.setDiagnosis(recordDetails.getDiagnosis());
        record.setSymptoms(recordDetails.getSymptoms());
        record.setTreatment(recordDetails.getTreatment());
        record.setPrescribedMedicines(recordDetails.getPrescribedMedicines());
        record.setNotes(recordDetails.getNotes());
        
        return medicalRecordRepository.save(record);
    }

    public void deleteMedicalRecord(String id) {
        if (!medicalRecordRepository.existsById(id)) {
            throw new ResourceNotFoundException("Medical record not found with id: " + id);
        }
        medicalRecordRepository.deleteById(id);
    }
}