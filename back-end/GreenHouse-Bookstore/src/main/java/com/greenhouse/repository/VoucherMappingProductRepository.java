package com.greenhouse.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.greenhouse.model.VoucherMappingProduct;

public interface VoucherMappingProductRepository extends JpaRepository<VoucherMappingProduct, Integer> {

    List<VoucherMappingProduct> findByVoucherId(Integer voucherId);


}
