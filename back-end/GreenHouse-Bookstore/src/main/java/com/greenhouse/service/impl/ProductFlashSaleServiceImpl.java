package com.greenhouse.service.impl;

import com.greenhouse.model.Product_FlashSale;
import com.greenhouse.repository.Product_FlashSaleRepository;
import com.greenhouse.service.ProductFlashSaleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductFlashSaleServiceImpl implements ProductFlashSaleService {

    @Autowired
    private Product_FlashSaleRepository productFlashSaleRepository;

    @Override
    public List<Product_FlashSale> findAll() {
        return productFlashSaleRepository.findAll();
    }

    @Override
    public Product_FlashSale findById(Integer id) {
        Optional<Product_FlashSale> result = productFlashSaleRepository.findById(id);
        return result.orElse(null);
    }

    @Override
    public void add(Product_FlashSale productFlashSale) {
        productFlashSaleRepository.save(productFlashSale);
    }

    @Override
    public void update(Product_FlashSale productFlashSale) {
        productFlashSaleRepository.save(productFlashSale);
    }

    @Override
    public void delete(Integer id) {
        productFlashSaleRepository.deleteById(id);
    }
}
