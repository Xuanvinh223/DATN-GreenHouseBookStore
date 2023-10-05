package com.greenhouse.service;

import com.greenhouse.model.ImportInvoice;

import java.util.List;

public interface ImportInvoiceService {

    List<ImportInvoice> findAll();

    ImportInvoice findById(Integer importInvoiceId);

    void add(ImportInvoice entity);

    void update(ImportInvoice entity);

    void delete(Integer importInvoiceId);
}
