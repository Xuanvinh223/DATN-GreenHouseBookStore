package com.greenhouse.service.impl;

import com.greenhouse.model.ImportInvoiceDetail;
import com.greenhouse.repository.ImportInvoiceDetailRepository;
import com.greenhouse.service.ImportInvoiceDetailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ImportInvoiceDetailServiceImpl implements ImportInvoiceDetailService {

    @Autowired
    private ImportInvoiceDetailRepository importInvoiceDetailRepository;

    @Override
    public List<ImportInvoiceDetail> findAll() {
        return importInvoiceDetailRepository.findAll();
    }

    @Override
    public ImportInvoiceDetail findById(Integer id) {
        Optional<ImportInvoiceDetail> result = importInvoiceDetailRepository.findById(id);
        return result.orElse(null);
    }

    @Override
    public void add(ImportInvoiceDetail importInvoiceDetail) {
        importInvoiceDetailRepository.save(importInvoiceDetail);
    }

    @Override
    public void update(ImportInvoiceDetail importInvoiceDetail) {
        importInvoiceDetailRepository.save(importInvoiceDetail);
    }

    @Override
    public void delete(Integer id) {
        importInvoiceDetailRepository.deleteById(id);
    }
}
