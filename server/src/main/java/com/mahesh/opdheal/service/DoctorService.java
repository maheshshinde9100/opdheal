package com.mahesh.opdheal.service;

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
        Optional<Doctor> optionalDoctor = doctorRepository.findById(id);
        if (optionalDoctor.isPresent()) {
            Doctor doctor = optionalDoctor.get();
            doctor.setSpecialization(doctorDetails.getSpecialization());
            doctor.setLicenseNumber(doctorDetails.getLicenseNumber());
            doctor.setPhoneNumber(doctorDetails.getPhoneNumber());
            doctor.setQualifications(doctorDetails.getQualifications());
            doctor.setExperienceYears(doctorDetails.getExperienceYears());
            doctor.setDepartment(doctorDetails.getDepartment());
            doctor.setAvailable(doctorDetails.isAvailable());
            return doctorRepository.save(doctor);
        }
        throw new RuntimeException("Doctor not found");
    }

    public void deleteDoctor(String id) {
        doctorRepository.deleteById(id);
    }
}