package com.mahesh.opdheal.service;

import com.mahesh.opdheal.exception.ResourceNotFoundException;
import com.mahesh.opdheal.model.Appointment;
import com.mahesh.opdheal.repository.AppointmentRepository;
import com.mahesh.opdheal.model.Doctor;
import com.mahesh.opdheal.repository.DoctorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DoctorService {

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    public Doctor createDoctor(Doctor doctor) {
        return doctorRepository.save(doctor);
    }

    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }

    public Optional<Doctor> getDoctorById(String id) {
        return doctorRepository.findById(id);
    }

    public Optional<Doctor> getDoctorByUserId(String userId) {
        return doctorRepository.findByUserId(userId);
    }

    public List<Doctor> getDoctorsBySpecialization(String specialization) {
        return doctorRepository.findBySpecialization(specialization);
    }

    public List<Doctor> getAvailableDoctors() {
        return doctorRepository.findByAvailable(true);
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
}