package com.mahesh.opdheal.service;

import com.mahesh.opdheal.exception.ResourceNotFoundException;
import com.mahesh.opdheal.model.Appointment;
import com.mahesh.opdheal.dto.AppointmentDto;
import com.mahesh.opdheal.repository.AppointmentRepository;
import com.mahesh.opdheal.repository.DoctorRepository;
import com.mahesh.opdheal.repository.PatientRepository;
import com.mahesh.opdheal.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;
    @Autowired
    private PatientRepository patientRepository;
    @Autowired
    private DoctorRepository doctorRepository;
    @Autowired
    private UserRepository userRepository;

    public AppointmentDto toDto(Appointment appointment) {
        AppointmentDto dto = new AppointmentDto();
        dto.setId(appointment.getId());
        dto.setPatientId(appointment.getPatientId());
        dto.setDoctorId(appointment.getDoctorId());
        dto.setAppointmentDateTime(appointment.getAppointmentDateTime());
        dto.setReason(appointment.getReason());
        dto.setStatus(appointment.getStatus());
        dto.setNotes(appointment.getNotes());

        // Fetch Patient Name
        patientRepository.findById(appointment.getPatientId()).ifPresent(p -> {
            userRepository.findById(p.getUserId()).ifPresent(u -> {
                dto.setPatientName(u.getFirstName() + " " + u.getLastName());
            });
        });

        // Fetch Doctor Name and Specialization
        doctorRepository.findById(appointment.getDoctorId()).ifPresent(d -> {
            dto.setDoctorSpecialization(d.getSpecialization());
            userRepository.findById(d.getUserId()).ifPresent(u -> {
                dto.setDoctorName("Dr. " + u.getFirstName() + " " + u.getLastName());
            });
        });

        return dto;
    }

    public Appointment createAppointment(Appointment appointment) {
        appointment.setCreatedAt(LocalDateTime.now());
        return appointmentRepository.save(appointment);
    }

    public List<AppointmentDto> getAllAppointments() {
        return appointmentRepository.findAll().stream()
                .map(this::toDto)
                .toList();
    }

    public Optional<Appointment> getAppointmentById(String id) {
        return appointmentRepository.findById(id);
    }

    public Optional<AppointmentDto> getAppointmentDtoById(String id) {
        return appointmentRepository.findById(id).map(this::toDto);
    }

    public List<AppointmentDto> getAppointmentsByPatient(String patientId) {
        return appointmentRepository.findByPatientId(patientId).stream()
                .map(this::toDto)
                .toList();
    }

    public List<AppointmentDto> getAppointmentsByDoctor(String doctorId) {
        return appointmentRepository.findByDoctorId(doctorId).stream()
                .map(this::toDto)
                .toList();
    }

    public List<AppointmentDto> getAppointmentsByDateRange(LocalDateTime start, LocalDateTime end) {
        return appointmentRepository.findByAppointmentDateTimeBetween(start, end).stream()
                .map(this::toDto)
                .toList();
    }

    public List<AppointmentDto> getAppointmentsByStatus(Appointment.Status status) {
        return appointmentRepository.findByStatus(status).stream()
                .map(this::toDto)
                .toList();
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