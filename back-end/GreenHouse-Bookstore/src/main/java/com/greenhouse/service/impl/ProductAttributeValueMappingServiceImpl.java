package com.greenhouse.service.impl;

import com.greenhouse.model.ProductAttributeValueMapping;
import com.greenhouse.repository.ProductAttributeValueMappingRepository;
import com.greenhouse.service.ProductAttributeValueMappingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductAttributeValueMappingServiceImpl implements ProductAttributeValueMappingService {

    @Autowired
    private ProductAttributeValueMappingRepository productAttributeValueMappingRepository;

    @Override
    public List<ProductAttributeValueMapping> findAll() {
        return productAttributeValueMappingRepository.findAll();
    }

    @Override
    public ProductAttributeValueMapping findById(Integer id) {
        Optional<ProductAttributeValueMapping> result = productAttributeValueMappingRepository.findById(id);
        return result.orElse(null);
    }

    @Override
    public ProductAttributeValueMapping add(ProductAttributeValueMapping entity) {
        return productAttributeValueMappingRepository.save(entity);
    }

    @Override
    public ProductAttributeValueMapping update(ProductAttributeValueMapping entity) {
        return productAttributeValueMappingRepository.save(entity);
    }

    @Override
    public void delete(Integer id) {
        productAttributeValueMappingRepository.deleteById(id);
    }
}
