package com.greenhouse.service;

import com.greenhouse.model.Product_Detail;

import java.util.List;

public interface ProductDetailService {

    List<Product_Detail> findAll();

    Product_Detail findById(Integer productDetailId);

    void add(Product_Detail entity);

    void update(Product_Detail entity);

    void delete(Integer productDetailId);
    
    List<Object[]> findAllInventoryList();
}
