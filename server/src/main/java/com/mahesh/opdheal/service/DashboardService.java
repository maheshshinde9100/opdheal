package com.mahesh.opdheal.service;

import com.mahesh.opdheal.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class DashboardService {

    @Autowired
    private PatientRepository patientRepository;
    @Autowired
    private DoctorRepository doctorRepository;
    @Autowired
    private AppointmentRepository appointmentRepository;
    @Autowired
    private PrescriptionRepository prescriptionRepository;
    @Autowired
    private BillRepository billRepository;

    public Map<String, Long> getStats() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("patients", patientRepository.count());
        stats.put("doctors", doctorRepository.count());
        stats.put("appointments", appointmentRepository.count());
        stats.put("prescriptions", prescriptionRepository.count());
        stats.put("bills", billRepository.count());
        return stats;
    }
}
