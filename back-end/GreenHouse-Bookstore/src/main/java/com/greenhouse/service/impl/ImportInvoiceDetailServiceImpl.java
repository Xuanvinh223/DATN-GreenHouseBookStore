package com.greenhouse.service.impl;

import com.greenhouse.model.ImportInvoice_Detail;
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
    public List<ImportInvoice_Detail> findAll() {
        return importInvoiceDetailRepository.findAll();
    }

    @Override
    public ImportInvoice_Detail findById(Integer id) {
        Optional<ImportInvoice_Detail> result = importInvoiceDetailRepository.findById(id);
        return result.orElse(null);
    }

    @Override
    public void add(ImportInvoice_Detail importInvoiceDetail) {
        importInvoiceDetailRepository.save(importInvoiceDetail);
    }

    @Override
    public void update(ImportInvoice_Detail importInvoiceDetail) {
        importInvoiceDetailRepository.save(importInvoiceDetail);
    }

    @Override
    public void delete(Integer id) {
        importInvoiceDetailRepository.deleteById(id);
    }
}
