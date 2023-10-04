package com.greenhouse.service;

import com.greenhouse.model.Import_Invoice_Detail;

import java.util.List;

public interface ImportInvoiceDetailService {

    List<Import_Invoice_Detail> findAll();

    Import_Invoice_Detail findById(Integer id);

    void add(Import_Invoice_Detail entity);

    void update(Import_Invoice_Detail entity);

    void delete(Integer id);
}
