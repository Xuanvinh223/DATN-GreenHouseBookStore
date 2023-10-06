package com.greenhouse.service;

import com.greenhouse.model.ImportInvoiceDetail;

import java.util.List;

public interface ImportInvoiceDetailService {

    List<ImportInvoiceDetail> findAll();

    ImportInvoiceDetail findById(Integer id);

    void add(ImportInvoiceDetail entity);

    void update(ImportInvoiceDetail entity);

    void delete(Integer id);
}
