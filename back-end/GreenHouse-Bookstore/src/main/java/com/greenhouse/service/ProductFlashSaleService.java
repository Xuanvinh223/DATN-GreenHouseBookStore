package com.greenhouse.service;

import com.greenhouse.model.Product_FlashSale;

import java.util.List;

public interface ProductFlashSaleService {

    List<Product_FlashSale> findAll();

    Product_FlashSale findById(Integer id);

    void add(Product_FlashSale entity);

    void update(Product_FlashSale entity);

    void delete(Integer id);
}
