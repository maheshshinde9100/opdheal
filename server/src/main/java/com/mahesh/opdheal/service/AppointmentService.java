package com.mahesh.opdheal.service;

import com.mahesh.opdheal.exception.ResourceNotFoundException;
import com.mahesh.opdheal.model.Appointment;
import com.mahesh.opdheal.repository.AppointmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    public Appointment createAppointment(Appointment appointment) {
        appointment.setCreatedAt(LocalDateTime.now());
        return appointmentRepository.save(appointment);
    }

    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    public Optional<Appointment> getAppointmentById(String id) {
        return appointmentRepository.findById(id);
    }

    public List<Appointment> getAppointmentsByPatient(String patientId) {
        return appointmentRepository.findByPatientId(patientId);
    }

    public List<Appointment> getAppointmentsByDoctor(String doctorId) {
        return appointmentRepository.findByDoctorId(doctorId);
    }

    public List<Appointment> getAppointmentsByDateRange(LocalDateTime start, LocalDateTime end) {
        return appointmentRepository.findByAppointmentDateTimeBetween(start, end);
    }

    public List<Appointment> getAppointmentsByStatus(Appointment.Status status) {
        return appointmentRepository.findByStatus(status);
    }

    public Appointment updateAppointment(String id, Appointment appointmentDetails) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with id: " + id));

        if (appointmentDetails.getPatientId() != null) appointment.setPatientId(appointmentDetails.getPatientId());
        if (appointmentDetails.getDoctorId() != null) appointment.setDoctorId(appointmentDetails.getDoctorId());
        if (appointmentDetails.getAppointmentDateTime() != null) appointment.setAppointmentDateTime(appointmentDetails.getAppointmentDateTime());
        if (appointmentDetails.getReason() != null) appointment.setReason(appointmentDetails.getReason());
        if (appointmentDetails.getStatus() != null) appointment.setStatus(appointmentDetails.getStatus());
        if (appointmentDetails.getNotes() != null) appointment.setNotes(appointmentDetails.getNotes());

        return appointmentRepository.save(appointment);
    }

    public void deleteAppointment(String id) {
        if (!appointmentRepository.existsById(id)) {
            throw new ResourceNotFoundException("Appointment not found with id: " + id);
        }
        appointmentRepository.deleteById(id);
    }
}