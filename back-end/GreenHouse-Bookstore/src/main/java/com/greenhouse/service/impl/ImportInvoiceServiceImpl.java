package com.greenhouse.service.impl;

import com.greenhouse.model.ImportInvoice;
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
    public List<ImportInvoice> findAll() {
        return importInvoiceRepository.findAll();
    }

    @Override
    public ImportInvoice findById(Integer importInvoiceId) {
        Optional<ImportInvoice> result = importInvoiceRepository.findById(importInvoiceId);
        return result.orElse(null);
    }

    @Override
    public void add(ImportInvoice importInvoice) {
        importInvoiceRepository.save(importInvoice);
    }

    @Override
    public void update(ImportInvoice importInvoice) {
        importInvoiceRepository.save(importInvoice);
    }

    @Override
    public void delete(Integer importInvoiceId) {
        importInvoiceRepository.deleteById(importInvoiceId);
    }
}
