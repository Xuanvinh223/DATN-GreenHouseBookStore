package com.greenhouse.service;

import com.greenhouse.model.ImportInvoice_Detail;

import java.util.List;

public interface ImportInvoiceDetailService {

    List<ImportInvoice_Detail> findAll();

    ImportInvoice_Detail findById(Integer id);

    void add(ImportInvoice_Detail entity);

    void update(ImportInvoice_Detail entity);

    void delete(Integer id);
}
