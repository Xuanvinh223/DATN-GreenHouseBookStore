package com.greenhouse.service.impl;

import com.greenhouse.model.InvoiceDetails;
import com.greenhouse.repository.InvoiceDetailsRepository;
import com.greenhouse.service.InvoiceDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class InvoiceDetailsServiceImpl implements InvoiceDetailsService {

    @Autowired
    private InvoiceDetailsRepository invoiceDetailsRepository;

    @Override
    public List<InvoiceDetails> findAll() {
        return invoiceDetailsRepository.findAll();
    }

    @Override
    public InvoiceDetails findById(Integer invoiceDetailId) {
        Optional<InvoiceDetails> result = invoiceDetailsRepository.findById(invoiceDetailId);
        return result.orElse(null);
    }

    @Override
    public void add(InvoiceDetails invoiceDetails) {
        invoiceDetailsRepository.save(invoiceDetails);
    }

    @Override
    public void update(InvoiceDetails invoiceDetails) {
        invoiceDetailsRepository.save(invoiceDetails);
    }

    @Override
    public void delete(Integer invoiceDetailId) {
        invoiceDetailsRepository.deleteById(invoiceDetailId);
    }

}
