package com.mahesh.opdheal.service;

import com.mahesh.opdheal.model.Bill;
import com.mahesh.opdheal.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
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

    public Map<String, Object> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalPatients", patientRepository.count());
        stats.put("totalDoctors", doctorRepository.count());
        stats.put("totalAppointments", appointmentRepository.count());
        stats.put("totalPrescriptions", prescriptionRepository.count());
        
        // Calculate Total Revenue from PAID bills
        BigDecimal totalRevenue = billRepository.findByStatus(Bill.Status.PAID)
                .stream()
                .map(Bill::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        stats.put("totalRevenue", totalRevenue);

        // Calculate Pending Bills count
        long pendingBills = billRepository.findByStatus(Bill.Status.PENDING).size();
        stats.put("pendingBills", pendingBills);

        // Calculate Today's Appointments
        LocalDateTime startOfDay = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0).withNano(0);
        LocalDateTime endOfDay = LocalDateTime.now().withHour(23).withMinute(59).withSecond(59).withNano(999999999);
        
        // Note: appointmentDateTime is used for listing today's sessions
        long todayAppointments = appointmentRepository.findByAppointmentDateTimeBetween(startOfDay, endOfDay).size();
        stats.put("todayAppointments", todayAppointments);

        return stats;
    }
}
