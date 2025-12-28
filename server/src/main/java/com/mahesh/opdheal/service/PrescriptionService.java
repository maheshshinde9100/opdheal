package com.mahesh.opdheal.service;

import com.mahesh.opdheal.exception.ResourceNotFoundException;
import com.mahesh.opdheal.model.Prescription;
import com.mahesh.opdheal.repository.PrescriptionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class PrescriptionService {

    @Autowired
    private PrescriptionRepository prescriptionRepository;

    public Prescription createPrescription(Prescription prescription) {
        prescription.setPrescriptionDate(LocalDateTime.now());
        return prescriptionRepository.save(prescription);
    }

    public List<Prescription> getAllPrescriptions() {
        return prescriptionRepository.findAll();
    }

    public Optional<Prescription> getPrescriptionById(String id) {
        return prescriptionRepository.findById(id);
    }

    public List<Prescription> getPrescriptionsByPatient(String patientId) {
        return prescriptionRepository.findByPatientId(patientId);
    }

    public List<Prescription> getPrescriptionsByDoctor(String doctorId) {
        return prescriptionRepository.findByDoctorId(doctorId);
    }

    public List<Prescription> getPrescriptionsByAppointment(String appointmentId) {
        return prescriptionRepository.findByAppointmentId(appointmentId);
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

        return prescriptionRepository.save(prescription);
    }

    public void deletePrescription(String id) {
        if (!prescriptionRepository.existsById(id)) {
            throw new ResourceNotFoundException("Prescription not found with id: " + id);
        }
        prescriptionRepository.deleteById(id);
    }
}