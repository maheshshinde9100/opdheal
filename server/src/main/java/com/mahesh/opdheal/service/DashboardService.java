package com.mahesh.opdheal.service;

import com.mahesh.opdheal.model.Appointment;
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
    @Autowired
    private MedicalRecordRepository medicalRecordRepository;

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

    public Map<String, Object> getDoctorStats(String doctorId) {
        Map<String, Object> stats = new HashMap<>();

        // Doctor's appointments
        List<Appointment> doctorAppointments = appointmentRepository.findByDoctorId(doctorId);
        stats.put("totalAppointments", doctorAppointments.size());

        // Today's appointments
        try {
            LocalDateTime startOfDay = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0).withNano(0);
            LocalDateTime endOfDay = LocalDateTime.now().withHour(23).withMinute(59).withSecond(59).withNano(999999999);
            long todayCount = doctorAppointments.stream()
                    .filter(a -> a.getAppointmentDateTime().isAfter(startOfDay) && a.getAppointmentDateTime().isBefore(endOfDay))
                    .count();
            stats.put("todayAppointments", todayCount);
        } catch (Exception e) {
            stats.put("todayAppointments", 0L);
        }

        // Appointments by status
        stats.put("scheduledAppointments", doctorAppointments.stream()
                .filter(a -> a.getStatus() == Appointment.Status.SCHEDULED).count());
        stats.put("confirmedAppointments", doctorAppointments.stream()
                .filter(a -> a.getStatus() == Appointment.Status.CONFIRMED).count());
        stats.put("inProgressAppointments", doctorAppointments.stream()
                .filter(a -> a.getStatus() == Appointment.Status.IN_PROGRESS).count());
        stats.put("completedAppointments", doctorAppointments.stream()
                .filter(a -> a.getStatus() == Appointment.Status.COMPLETED).count());
        stats.put("cancelledAppointments", doctorAppointments.stream()
                .filter(a -> a.getStatus() == Appointment.Status.CANCELLED).count());
        stats.put("noShowAppointments", doctorAppointments.stream()
                .filter(a -> a.getStatus() == Appointment.Status.NO_SHOW).count());

        // Total unique patients
        long uniquePatients = doctorAppointments.stream()
                .map(Appointment::getPatientId)
                .distinct()
                .count();
        stats.put("uniquePatients", uniquePatients);

        // Total prescriptions
        stats.put("totalPrescriptions", prescriptionRepository.findByDoctorId(doctorId).size());

        // Total medical records
        stats.put("totalMedicalRecords", medicalRecordRepository.findByDoctorId(doctorId).size());

        return stats;
    }

    public Map<String, Object> getPatientStats(String patientId) {
        Map<String, Object> stats = new HashMap<>();

        // Patient's appointments
        List<Appointment> patientAppointments = appointmentRepository.findByPatientId(patientId);
        stats.put("totalAppointments", patientAppointments.size());

        // Upcoming appointments
        try {
            LocalDateTime now = LocalDateTime.now();
            long upcomingCount = patientAppointments.stream()
                    .filter(a -> a.getAppointmentDateTime().isAfter(now))
                    .filter(a -> a.getStatus() == Appointment.Status.SCHEDULED ||
                            a.getStatus() == Appointment.Status.CONFIRMED)
                    .count();
            stats.put("upcomingAppointments", upcomingCount);
        } catch (Exception e) {
            stats.put("upcomingAppointments", 0L);
        }

        // Appointments by status
        stats.put("completedAppointments", patientAppointments.stream()
                .filter(a -> a.getStatus() == Appointment.Status.COMPLETED).count());

        // Total prescriptions
        stats.put("totalPrescriptions", prescriptionRepository.findByPatientId(patientId).size());

        // Total medical records
        stats.put("totalMedicalRecords", medicalRecordRepository.findByPatientId(patientId).size());

        // Bills
        List<Bill> patientBills = billRepository.findByPatientId(patientId);
        stats.put("totalBills", patientBills.size());
        stats.put("paidBills", patientBills.stream()
                .filter(b -> b.getStatus() == Bill.Status.PAID).count());
        stats.put("pendingBills", patientBills.stream()
                .filter(b -> b.getStatus() == Bill.Status.PENDING).count());

        return stats;
    }
}
