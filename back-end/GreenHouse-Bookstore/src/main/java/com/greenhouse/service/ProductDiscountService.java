package com.greenhouse.service;

import com.greenhouse.model.Product_Discount;

import java.util.List;

public interface ProductDiscountService {

    List<Product_Discount> findAll();

    Product_Discount findById(Integer id);

    void add(Product_Discount entity);

    void update(Product_Discount entity);

    void delete(Integer id);
}
