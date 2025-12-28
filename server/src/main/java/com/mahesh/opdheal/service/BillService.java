package com.mahesh.opdheal.service;

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
        Optional<Bill> optionalBill = billRepository.findById(id);
        if (optionalBill.isPresent()) {
            Bill bill = optionalBill.get();
            bill.setConsultationFee(billDetails.getConsultationFee());
            bill.setMedicineFee(billDetails.getMedicineFee());
            bill.setTotalAmount(bill.getConsultationFee().add(bill.getMedicineFee()));
            bill.setStatus(billDetails.getStatus());
            if (billDetails.getStatus() == Bill.Status.PAID) {
                bill.setPaymentDate(LocalDateTime.now());
            }
            bill.setItems(billDetails.getItems());
            return billRepository.save(bill);
        }
        throw new RuntimeException("Bill not found");
    }

    public void deleteBill(String id) {
        billRepository.deleteById(id);
    }
}