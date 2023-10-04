package com.greenhouse.service;

import com.greenhouse.model.Import_Invoice;

import java.util.List;

public interface ImportInvoiceService {

    List<Import_Invoice> findAll();

    Import_Invoice findById(Integer importInvoiceId);

    void add(Import_Invoice entity);

    void update(Import_Invoice entity);

    void delete(Integer importInvoiceId);
}
