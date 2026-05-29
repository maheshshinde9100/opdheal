package com.mahesh.opdheal.service;

import com.mahesh.opdheal.exception.ResourceNotFoundException;
import com.mahesh.opdheal.model.Prescription;
import com.mahesh.opdheal.dto.PrescriptionDto;
import com.mahesh.opdheal.repository.PrescriptionRepository;
import com.mahesh.opdheal.repository.DoctorRepository;
import com.mahesh.opdheal.repository.PatientRepository;
import com.mahesh.opdheal.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class PrescriptionService {

    @Autowired
    private PrescriptionRepository prescriptionRepository;
    @Autowired
    private PatientRepository patientRepository;
    @Autowired
    private DoctorRepository doctorRepository;
    @Autowired
    private UserRepository userRepository;

    public PrescriptionDto toDto(Prescription prescription) {
        PrescriptionDto dto = new PrescriptionDto();
        dto.setId(prescription.getId());
        dto.setPatientId(prescription.getPatientId());
        dto.setDoctorId(prescription.getDoctorId());
        dto.setAppointmentId(prescription.getAppointmentId());
        dto.setPrescriptionDate(prescription.getPrescriptionDate());
        dto.setMedicines(prescription.getMedicines());
        dto.setInstructions(prescription.getInstructions());
        dto.setNotes(prescription.getNotes());

        // Fetch Patient Name
        patientRepository.findById(prescription.getPatientId()).ifPresent(p -> {
            userRepository.findById(p.getUserId()).ifPresent(u -> {
                dto.setPatientName(u.getFirstName() + " " + u.getLastName());
            });
        });

        // Fetch Doctor Name and Specialization
        doctorRepository.findById(prescription.getDoctorId()).ifPresent(d -> {
            dto.setDoctorSpecialization(d.getSpecialization());
            userRepository.findById(d.getUserId()).ifPresent(u -> {
                dto.setDoctorName("Dr. " + u.getFirstName() + " " + u.getLastName());
            });
        });

        return dto;
    }

    public Prescription createPrescription(Prescription prescription) {
        prescription.setPrescriptionDate(LocalDateTime.now());
        return prescriptionRepository.save(prescription);
    }

    public List<PrescriptionDto> getAllPrescriptions() {
        return prescriptionRepository.findAll().stream()
                .map(this::toDto)
                .toList();
    }

    public Optional<Prescription> getPrescriptionById(String id) {
        return prescriptionRepository.findById(id);
    }

    public List<PrescriptionDto> getPrescriptionsByPatient(String patientId) {
        return prescriptionRepository.findByPatientId(patientId).stream()
                .map(this::toDto)
                .toList();
    }

    public List<PrescriptionDto> getPrescriptionsByDoctor(String doctorId) {
        return prescriptionRepository.findByDoctorId(doctorId).stream()
                .map(this::toDto)
                .toList();
    }

    public List<PrescriptionDto> getPrescriptionsByAppointment(String appointmentId) {
        return prescriptionRepository.findByAppointmentId(appointmentId).stream()
                .map(this::toDto)
                .toList();
    }

    public Prescription updatePrescription(String id, Prescription prescriptionDetails) {
        Prescription prescription = prescriptionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Prescription not found with id: " + id));

        prescription.setPatientId(prescriptionDetails.getPatientId());
        prescription.setDoctorId(prescriptionDetails.getDoctorId());
        prescription.setAppointmentId(prescriptionDetails.getAppointmentId());
        prescription.setMedicines(prescriptionDetails.getMedicines());
        prescription.setInstructions(prescriptionDetails.getInstructions());
        prescription.setNotes(prescriptionDetails.getNotes());
        prescription.setUpdatedAt(LocalDateTime.now());

        return prescriptionRepository.save(prescription);
    }

    public void deletePrescription(String id) {
        if (!prescriptionRepository.existsById(id)) {
            throw new ResourceNotFoundException("Prescription not found with id: " + id);
        }
        prescriptionRepository.deleteById(id);
    }
}