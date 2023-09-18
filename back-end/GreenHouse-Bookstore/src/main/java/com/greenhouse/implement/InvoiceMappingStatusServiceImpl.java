package com.greenhouse.implement;

import com.greenhouse.model.InvoiceMappingStatus;
import com.greenhouse.repository.InvoiceMappingStatusRepository;
import com.greenhouse.service.InvoiceMappingStatusService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class InvoiceMappingStatusServiceImpl implements InvoiceMappingStatusService {

    @Autowired
    private InvoiceMappingStatusRepository invoiceMappingStatusRepository;

    @Override
    public List<InvoiceMappingStatus> findAll() {
        return invoiceMappingStatusRepository.findAll();
    }

    @Override
    public InvoiceMappingStatus findById(Integer invoiceOrderStatusId) {
        Optional<InvoiceMappingStatus> result = invoiceMappingStatusRepository.findById(invoiceOrderStatusId);
        return result.orElse(null);
    }

    @Override
    public void add(InvoiceMappingStatus invoiceMappingStatus) {
        invoiceMappingStatusRepository.save(invoiceMappingStatus);
    }

    @Override
    public void update(InvoiceMappingStatus invoiceMappingStatus) {
        invoiceMappingStatusRepository.save(invoiceMappingStatus);
    }

    @Override
    public void delete(Integer invoiceOrderStatusId) {
        invoiceMappingStatusRepository.deleteById(invoiceOrderStatusId);
    }
}
