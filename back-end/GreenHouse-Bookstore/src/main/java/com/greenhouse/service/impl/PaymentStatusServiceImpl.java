package com.greenhouse.service.impl;

import com.greenhouse.model.PaymentStatus;
import com.greenhouse.repository.PaymentStatusRepository;
import com.greenhouse.service.PaymentStatusService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PaymentStatusServiceImpl implements PaymentStatusService {

    @Autowired
    private PaymentStatusRepository paymentStatusRepository;

    @Override
    public List<PaymentStatus> findAll() {
        return paymentStatusRepository.findAll();
    }

    @Override
    public PaymentStatus findById(Integer statusId) {
        Optional<PaymentStatus> result = paymentStatusRepository.findById(statusId);
        return result.orElse(null);
    }

    @Override
    public void add(PaymentStatus paymentStatus) {
        paymentStatusRepository.save(paymentStatus);
    }

    @Override
    public void update(PaymentStatus paymentStatus) {
        paymentStatusRepository.save(paymentStatus);
    }

    @Override
    public void delete(Integer statusId) {
        paymentStatusRepository.deleteById(statusId);
    }
}
