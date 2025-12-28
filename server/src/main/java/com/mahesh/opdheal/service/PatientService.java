package com.mahesh.opdheal.service;

import com.mahesh.opdheal.model.Patient;
import com.mahesh.opdheal.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PatientService {

    @Autowired
    private PatientRepository patientRepository;

    public Patient createPatient(Patient patient) {
        return patientRepository.save(patient);
    }

    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }

    public Optional<Patient> getPatientById(String id) {
        return patientRepository.findById(id);
    }

    public Optional<Patient> getPatientByUserId(String userId) {
        return patientRepository.findByUserId(userId);
    }

    public Patient updatePatient(String id, Patient patientDetails) {
        Optional<Patient> optionalPatient = patientRepository.findById(id);
        if (optionalPatient.isPresent()) {
            Patient patient = optionalPatient.get();
            patient.setPhoneNumber(patientDetails.getPhoneNumber());
            patient.setDateOfBirth(patientDetails.getDateOfBirth());
            patient.setGender(patientDetails.getGender());
            patient.setAddress(patientDetails.getAddress());
            patient.setEmergencyContact(patientDetails.getEmergencyContact());
            patient.setAllergies(patientDetails.getAllergies());
            patient.setBloodGroup(patientDetails.getBloodGroup());
            patient.setMedicalHistory(patientDetails.getMedicalHistory());
            return patientRepository.save(patient);
        }
        throw new RuntimeException("Patient not found");
    }

    public void deletePatient(String id) {
        patientRepository.deleteById(id);
    }
}