package com.greenhouse.service;

import com.greenhouse.model.PaymentStatus;

import java.util.List;

public interface PaymentStatusService {

    List<PaymentStatus> findAll();

    PaymentStatus findById(Integer statusId);

    void add(PaymentStatus entity);

    void update(PaymentStatus entity);

    void delete(Integer statusId);
}
