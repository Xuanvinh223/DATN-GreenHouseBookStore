package com.greenhouse.service;

import com.greenhouse.model.Products;

import java.util.List;

public interface ProductsService {

    List<Products> findAll();

    Products findById(String productId);

    void add(Products entity);

    void update(Products entity);

    void delete(String productId);
}
