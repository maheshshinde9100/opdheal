package com.mahesh.opdheal.service;

import com.mahesh.opdheal.model.Bill;
import com.mahesh.opdheal.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
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

        // Core counts
        stats.put("totalPatients", patientRepository.count());
        stats.put("totalDoctors", doctorRepository.count());
        stats.put("totalAppointments", appointmentRepository.count());
        stats.put("totalPrescriptions", prescriptionRepository.count());

        // Calculate Total Revenue from PAID bills
        try {
            List<Bill> paidBills = billRepository.findByStatus(Bill.Status.PAID);
            BigDecimal totalRevenue = paidBills.stream()
                    .map(b -> b.getTotalAmount() != null ? b.getTotalAmount() : BigDecimal.ZERO)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            stats.put("totalRevenue", totalRevenue);
        } catch (Exception e) {
            stats.put("totalRevenue", BigDecimal.ZERO);
        }

        // Pending Bills count
        try {
            long pendingBills = billRepository.findByStatus(Bill.Status.PENDING).size();
            stats.put("pendingBills", pendingBills);
        } catch (Exception e) {
            stats.put("pendingBills", 0L);
        }

        // Today's Appointments
        try {
            LocalDateTime startOfDay = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0).withNano(0);
            LocalDateTime endOfDay = LocalDateTime.now().withHour(23).withMinute(59).withSecond(59).withNano(999999999);
            long todayAppointments = appointmentRepository.findByAppointmentDateTimeBetween(startOfDay, endOfDay).size();
            stats.put("todayAppointments", todayAppointments);
        } catch (Exception e) {
            stats.put("todayAppointments", 0L);
        }

        return stats;
    }
}
