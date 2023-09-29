package com.greenhouse.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.greenhouse.model.InvoiceMappingVoucher;

@Repository
public interface InvoiceMappingVoucherRepository extends JpaRepository<InvoiceMappingVoucher, Integer> {
    
}
