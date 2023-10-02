package com.greenhouse.service;

import com.greenhouse.model.Product_Detail;

import java.util.List;

public interface ProductDetailService {

    List<Product_Detail> findAll();

    Product_Detail findById(Integer productDetailId);

    Product_Detail add(Product_Detail entity);

    Product_Detail update(Product_Detail entity);

    void delete(Integer productDetailId);

    List<Product_Detail> findProductsByStatus();
}
