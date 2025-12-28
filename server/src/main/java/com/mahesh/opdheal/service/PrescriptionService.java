package com.mahesh.opdheal.service;

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
        Optional<Prescription> optionalPrescription = prescriptionRepository.findById(id);
        if (optionalPrescription.isPresent()) {
            Prescription prescription = optionalPrescription.get();
            prescription.setMedicines(prescriptionDetails.getMedicines());
            prescription.setInstructions(prescriptionDetails.getInstructions());
            prescription.setNotes(prescriptionDetails.getNotes());
            return prescriptionRepository.save(prescription);
        }
        throw new RuntimeException("Prescription not found");
    }

    public void deletePrescription(String id) {
        prescriptionRepository.deleteById(id);
    }
}