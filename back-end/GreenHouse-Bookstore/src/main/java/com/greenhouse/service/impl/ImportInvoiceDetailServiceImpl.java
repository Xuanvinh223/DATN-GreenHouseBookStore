package com.greenhouse.service.impl;

import com.greenhouse.model.Import_Invoice_Detail;
import com.greenhouse.repository.ImportInvoice_DetailRepository;
import com.greenhouse.service.ImportInvoiceDetailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ImportInvoiceDetailServiceImpl implements ImportInvoiceDetailService {

    @Autowired
    private ImportInvoice_DetailRepository importInvoiceDetailRepository;

    @Override
    public List<Import_Invoice_Detail> findAll() {
        return importInvoiceDetailRepository.findAll();
    }

    @Override
    public Import_Invoice_Detail findById(Integer id) {
        Optional<Import_Invoice_Detail> result = importInvoiceDetailRepository.findById(id);
        return result.orElse(null);
    }

    @Override
    public void add(Import_Invoice_Detail importInvoiceDetail) {
        importInvoiceDetailRepository.save(importInvoiceDetail);
    }

    @Override
    public void update(Import_Invoice_Detail importInvoiceDetail) {
        importInvoiceDetailRepository.save(importInvoiceDetail);
    }

    @Override
    public void delete(Integer id) {
        importInvoiceDetailRepository.deleteById(id);
    }
}
