package com.greenhouse.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.greenhouse.model.ImportInvoiceDetail;

@Repository
public interface ImportInvoiceDetailRepository extends JpaRepository<ImportInvoiceDetail, Integer> {

}
