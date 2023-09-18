package com.greenhouse.implement;

import com.greenhouse.model.Invoices;
import com.greenhouse.repository.InvoicesRepository;
import com.greenhouse.service.InvoicesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class InvoicesServiceImpl implements InvoicesService {

    @Autowired
    private InvoicesRepository invoicesRepository;

    @Override
    public List<Invoices> findAll() {
        return invoicesRepository.findAll();
    }

    @Override
    public Invoices findById(Integer invoiceId) {
        Optional<Invoices> result = invoicesRepository.findById(invoiceId);
        return result.orElse(null);
    }

    @Override
    public void add(Invoices invoices) {
        invoicesRepository.save(invoices);
    }

    @Override
    public void update(Invoices invoices) {
        invoicesRepository.save(invoices);
    }

    @Override
    public void delete(Integer invoiceId) {
        invoicesRepository.deleteById(invoiceId);
    }
}
