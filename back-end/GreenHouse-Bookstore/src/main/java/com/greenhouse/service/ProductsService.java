package com.greenhouse.service;

import com.greenhouse.model.Products;

import java.util.List;

public interface ProductsService {

    List<Products> findAll();

    Products findById(String productId);

    Products add(Products entity);

    Products update(Products entity);

    void delete(String productId);
}
