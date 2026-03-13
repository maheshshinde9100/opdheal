package com.mahesh.opdheal.service;

import com.mahesh.opdheal.dto.PatientDto;
import com.mahesh.opdheal.dto.PatientHistoryDto;
import com.mahesh.opdheal.exception.ResourceNotFoundException;
import com.mahesh.opdheal.model.Appointment;
import com.mahesh.opdheal.model.MedicalRecord;
import com.mahesh.opdheal.model.Patient;
import com.mahesh.opdheal.model.Prescription;
import com.mahesh.opdheal.repository.AppointmentRepository;
import com.mahesh.opdheal.repository.MedicalRecordRepository;
import com.mahesh.opdheal.repository.PrescriptionRepository;
import com.mahesh.opdheal.repository.PatientRepository;
import com.mahesh.opdheal.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PatientService {

    @Autowired
    private PatientRepository patientRepository;
    @Autowired
    private AppointmentRepository appointmentRepository;
    @Autowired
    private PrescriptionRepository prescriptionRepository;
    @Autowired
    private MedicalRecordRepository medicalRecordRepository;
    @Autowired
    private UserRepository userRepository;

    public Patient createPatient(Patient patient) {
        return patientRepository.save(patient);
    }

    public List<PatientDto> getAllPatients() {
        return patientRepository.findAll().stream().map(this::toPatientDto).toList();
    }

    public Optional<PatientDto> getPatientById(String id) {
        return patientRepository.findById(id).map(this::toPatientDto);
    }

    public Optional<PatientDto> getPatientByUserId(String userId) {
        return patientRepository.findByUserId(userId).map(this::toPatientDto);
    }

    public Patient updatePatient(String id, Patient patientDetails) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id: " + id));

        patient.setUserId(patientDetails.getUserId());
        patient.setPhoneNumber(patientDetails.getPhoneNumber());
        patient.setDateOfBirth(patientDetails.getDateOfBirth());
        patient.setGender(patientDetails.getGender());
        patient.setAddress(patientDetails.getAddress());
        patient.setEmergencyContact(patientDetails.getEmergencyContact());
        patient.setAllergies(patientDetails.getAllergies());
        patient.setBloodGroup(patientDetails.getBloodGroup());
        patient.setWeight(patientDetails.getWeight());
        patient.setMedicalHistory(patientDetails.getMedicalHistory());

        return patientRepository.save(patient);
    }

    public void deletePatient(String id) {
        if (!patientRepository.existsById(id)) {
            throw new ResourceNotFoundException("Patient not found with id: " + id);
        }
        patientRepository.deleteById(id);
    }

    public PatientHistoryDto getPatientHistory(String patientId) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id: " + patientId));

        List<Appointment> appointments = appointmentRepository.findByPatientId(patientId);
        List<Prescription> prescriptions = prescriptionRepository.findByPatientId(patientId);
        List<MedicalRecord> medicalRecords = medicalRecordRepository.findByPatientId(patientId);

        PatientDto patientDto = toPatientDto(patient);

        PatientHistoryDto historyDto = new PatientHistoryDto();
        historyDto.setPatient(patientDto);
        historyDto.setAppointments(appointments);
        historyDto.setPrescriptions(prescriptions);
        historyDto.setMedicalRecords(medicalRecords);

        return historyDto;
    }

    private PatientDto toPatientDto(Patient patient) {
        PatientDto dto = new PatientDto();
        dto.setId(patient.getId());
        dto.setUserId(patient.getUserId());
        dto.setPhoneNumber(patient.getPhoneNumber());
        dto.setDateOfBirth(patient.getDateOfBirth());
        dto.setGender(patient.getGender());
        dto.setAddress(patient.getAddress());
        dto.setEmergencyContact(patient.getEmergencyContact());
        dto.setAllergies(patient.getAllergies());
        dto.setBloodGroup(patient.getBloodGroup());
        dto.setWeight(patient.getWeight());
        dto.setMedicalHistory(patient.getMedicalHistory());

        userRepository.findById(patient.getUserId()).ifPresent(u -> {
            dto.setFirstName(u.getFirstName());
            dto.setLastName(u.getLastName());
            dto.setEmail(u.getEmail());
        });

        return dto;
    }
}