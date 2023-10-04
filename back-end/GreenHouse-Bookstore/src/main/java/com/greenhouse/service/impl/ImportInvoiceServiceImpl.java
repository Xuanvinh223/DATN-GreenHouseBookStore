package com.greenhouse.service.impl;

import com.greenhouse.model.Import_Invoice;
import com.greenhouse.repository.ImportInvoiceRepository;
import com.greenhouse.service.ImportInvoiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ImportInvoiceServiceImpl implements ImportInvoiceService {

    @Autowired
    private ImportInvoiceRepository importInvoiceRepository;

    @Override
    public List<Import_Invoice> findAll() {
        return importInvoiceRepository.findAll();
    }

    @Override
    public Import_Invoice findById(Integer importInvoiceId) {
        Optional<Import_Invoice> result = importInvoiceRepository.findById(importInvoiceId);
        return result.orElse(null);
    }

    @Override
    public void add(Import_Invoice importInvoice) {
        importInvoiceRepository.save(importInvoice);
    }

    @Override
    public void update(Import_Invoice importInvoice) {
        importInvoiceRepository.save(importInvoice);
    }

    @Override
    public void delete(Integer importInvoiceId) {
        importInvoiceRepository.deleteById(importInvoiceId);
    }
}
