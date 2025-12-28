package com.mahesh.opdheal.service;

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
        Optional<MedicalRecord> optionalRecord = medicalRecordRepository.findById(id);
        if (optionalRecord.isPresent()) {
            MedicalRecord record = optionalRecord.get();
            record.setDiagnosis(recordDetails.getDiagnosis());
            record.setSymptoms(recordDetails.getSymptoms());
            record.setTreatment(recordDetails.getTreatment());
            record.setPrescribedMedicines(recordDetails.getPrescribedMedicines());
            record.setNotes(recordDetails.getNotes());
            return medicalRecordRepository.save(record);
        }
        throw new RuntimeException("Medical record not found");
    }

    public void deleteMedicalRecord(String id) {
        medicalRecordRepository.deleteById(id);
    }
}