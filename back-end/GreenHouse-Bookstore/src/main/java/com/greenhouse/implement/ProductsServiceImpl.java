package com.greenhouse.implement;

import com.greenhouse.model.Products;
import com.greenhouse.repository.ProductsRepository;
import com.greenhouse.service.ProductsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductsServiceImpl implements ProductsService {

    @Autowired
    private ProductsRepository productsRepository;

    @Override
    public List<Products> findAll() {
        return productsRepository.findAll();
    }

    @Override
    public Products findById(String productId) {
        Optional<Products> result = productsRepository.findById(productId);
        return result.orElse(null);
    }

    @Override
    public void add(Products product) {
        productsRepository.save(product);
    }

    @Override
    public void update(Products product) {
        productsRepository.save(product);
    }

    @Override
    public void delete(String productId) {
        productsRepository.deleteById(productId);
    }
}
