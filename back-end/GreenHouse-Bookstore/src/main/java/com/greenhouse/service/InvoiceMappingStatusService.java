package com.greenhouse.service;

import com.greenhouse.model.InvoiceMappingStatus;

import java.util.List;

public interface InvoiceMappingStatusService {

    List<InvoiceMappingStatus> findAll();

    InvoiceMappingStatus findById(Integer invoiceOrderStatusId);

    void add(InvoiceMappingStatus entity);

    void update(InvoiceMappingStatus entity);

    void delete(Integer invoiceOrderStatusId);
}
