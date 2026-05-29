package com.mahesh.opdheal.service;

import com.mahesh.opdheal.exception.ResourceNotFoundException;
import com.mahesh.opdheal.model.Bill;
import com.mahesh.opdheal.repository.BillRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class BillService {

    @Autowired
    private BillRepository billRepository;

    public Bill createBill(Bill bill) {
        bill.setBillDate(LocalDateTime.now());
        bill.setTotalAmount(bill.getConsultationFee().add(bill.getMedicineFee()));
        bill.setCreatedAt(LocalDateTime.now());
        bill.setUpdatedAt(LocalDateTime.now());
        return billRepository.save(bill);
    }

    public List<Bill> getAllBills() {
        return billRepository.findAll();
    }

    public Optional<Bill> getBillById(String id) {
        return billRepository.findById(id);
    }

    public List<Bill> getBillsByPatient(String patientId) {
        return billRepository.findByPatientId(patientId);
    }

    public List<Bill> getBillsByAppointment(String appointmentId) {
        return billRepository.findByAppointmentId(appointmentId);
    }

    public List<Bill> getBillsByStatus(Bill.Status status) {
        return billRepository.findByStatus(status);
    }

    public Bill updateBill(String id, Bill billDetails) {
        Bill bill = billRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bill not found with id: " + id));

        bill.setPatientId(billDetails.getPatientId());
        bill.setAppointmentId(billDetails.getAppointmentId());
        bill.setConsultationFee(billDetails.getConsultationFee());
        bill.setMedicineFee(billDetails.getMedicineFee());
        bill.setTotalAmount(bill.getConsultationFee().add(bill.getMedicineFee()));
        bill.setStatus(billDetails.getStatus());
        if (billDetails.getStatus() == Bill.Status.PAID) {
            bill.setPaymentDate(LocalDateTime.now());
        }
        bill.setItems(billDetails.getItems());
        bill.setUpdatedAt(LocalDateTime.now());

        return billRepository.save(bill);
    }

    public void deleteBill(String id) {
        if (!billRepository.existsById(id)) {
            throw new ResourceNotFoundException("Bill not found with id: " + id);
        }
        billRepository.deleteById(id);
    }
}