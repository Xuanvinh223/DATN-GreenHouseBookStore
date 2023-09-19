package com.greenhouse.service;

import com.greenhouse.model.Invoices;

import java.util.List;

public interface InvoicesService {

    List<Invoices> findAll();

    Invoices findById(Integer invoiceId);

    void add(Invoices entity);

    void update(Invoices entity);

    void delete(Integer invoiceId);
}
