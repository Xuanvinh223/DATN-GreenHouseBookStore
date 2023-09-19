package com.greenhouse.service;

import com.greenhouse.model.InvoiceDetails;

import java.util.List;

public interface InvoiceDetailsService {

    List<InvoiceDetails> findAll();

    InvoiceDetails findById(Integer invoiceDetailId);

    void add(InvoiceDetails entity);

    void update(InvoiceDetails entity);

    void delete(Integer invoiceDetailId);
}
