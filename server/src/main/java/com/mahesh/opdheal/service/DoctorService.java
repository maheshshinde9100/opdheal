package com.mahesh.opdheal.service;

import com.mahesh.opdheal.exception.ResourceNotFoundException;
import com.mahesh.opdheal.model.Appointment;
import com.mahesh.opdheal.dto.DoctorDto;
import com.mahesh.opdheal.repository.AppointmentRepository;
import com.mahesh.opdheal.model.Doctor;
import com.mahesh.opdheal.repository.DoctorRepository;
import com.mahesh.opdheal.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class DoctorService {

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;
    @Autowired
    private UserRepository userRepository;

    public Doctor createDoctor(Doctor doctor) {
        doctor.setCreatedAt(LocalDateTime.now());
        doctor.setUpdatedAt(LocalDateTime.now());
        return doctorRepository.save(doctor);
    }

    public List<DoctorDto> getAllDoctors() {
        return doctorRepository.findAll().stream().map(this::toDoctorDto).toList();
    }

    public Optional<DoctorDto> getDoctorById(String id) {
        return doctorRepository.findById(id).map(this::toDoctorDto);
    }

    public Optional<DoctorDto> getDoctorByUserId(String userId) {
        return doctorRepository.findByUserId(userId).map(this::toDoctorDto);
    }

    public List<DoctorDto> getDoctorsBySpecialization(String specialization) {
        return doctorRepository.findBySpecialization(specialization).stream().map(this::toDoctorDto).toList();
    }

    public List<DoctorDto> getAvailableDoctors() {
        return doctorRepository.findByAvailable(true).stream().map(this::toDoctorDto).toList();
    }

    public Doctor updateDoctor(String id, Doctor doctorDetails) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with id: " + id));

        doctor.setUserId(doctorDetails.getUserId());
        doctor.setSpecialization(doctorDetails.getSpecialization());
        doctor.setLicenseNumber(doctorDetails.getLicenseNumber());
        doctor.setPhoneNumber(doctorDetails.getPhoneNumber());
        doctor.setQualifications(doctorDetails.getQualifications());
        doctor.setExperienceYears(doctorDetails.getExperienceYears());
        doctor.setDepartment(doctorDetails.getDepartment());
        doctor.setAvailable(doctorDetails.isAvailable());
        doctor.setUpdatedAt(LocalDateTime.now());

        return doctorRepository.save(doctor);
    }

    public void deleteDoctor(String id) {
        if (!doctorRepository.existsById(id)) {
            throw new ResourceNotFoundException("Doctor not found with id: " + id);
        }
        doctorRepository.deleteById(id);
    }

    public List<Appointment> getAppointmentsForDoctor(String doctorId) {
        return appointmentRepository.findByDoctorId(doctorId);
    }

    private DoctorDto toDoctorDto(Doctor doctor) {
        DoctorDto dto = new DoctorDto();
        dto.setId(doctor.getId());
        dto.setUserId(doctor.getUserId());
        dto.setSpecialization(doctor.getSpecialization());
        dto.setLicenseNumber(doctor.getLicenseNumber());
        dto.setPhoneNumber(doctor.getPhoneNumber());
        dto.setQualifications(doctor.getQualifications());
        dto.setExperienceYears(doctor.getExperienceYears());
        dto.setDepartment(doctor.getDepartment());
        dto.setAvailable(doctor.isAvailable());
        dto.setAverageRating(doctor.getAverageRating());
        dto.setRatingCount(doctor.getRatingCount());
        dto.setConsultationFee(doctor.getConsultationFee());

        userRepository.findById(doctor.getUserId()).ifPresent(u -> {
            dto.setFirstName(u.getFirstName());
            dto.setLastName(u.getLastName());
            dto.setEmail(u.getEmail());
        });

        return dto;
    }
}