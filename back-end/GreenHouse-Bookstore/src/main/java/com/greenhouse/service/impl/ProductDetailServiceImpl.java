package com.greenhouse.service.impl;

import com.greenhouse.model.Product_Detail;
import com.greenhouse.repository.ProductDetailRepository;
import com.greenhouse.service.ProductDetailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductDetailServiceImpl implements ProductDetailService {

    @Autowired
    private ProductDetailRepository productDetailRepository;

    @Override
    public List<Product_Detail> findAll() {
        return productDetailRepository.findAll();
    }

    @Override
    public Product_Detail findById(Integer productDetailId) {
        Optional<Product_Detail> result = productDetailRepository.findById(productDetailId);
        return result.orElse(null);
    }

    @Override
    public Product_Detail add(Product_Detail productDetail) {
        return productDetailRepository.save(productDetail);
    }

    @Override
    public Product_Detail update(Product_Detail productDetail) {
        return productDetailRepository.save(productDetail);
    }

    @Override
    public void delete(Integer productDetailId) {
        productDetailRepository.deleteById(productDetailId);
    }
}
