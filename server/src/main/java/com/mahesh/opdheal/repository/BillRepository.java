package com.mahesh.opdheal.repository;

import com.mahesh.opdheal.model.Bill;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BillRepository extends MongoRepository<Bill, String> {
    List<Bill> findByPatientId(String patientId);
    List<Bill> findByAppointmentId(String appointmentId);
    List<Bill> findByStatus(Bill.Status status);
}