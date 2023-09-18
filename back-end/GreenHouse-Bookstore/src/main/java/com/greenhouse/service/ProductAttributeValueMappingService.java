package com.greenhouse.service;

import com.greenhouse.model.ProductAttributeValueMapping;

import java.util.List;

public interface ProductAttributeValueMappingService {

    List<ProductAttributeValueMapping> findAll();

    ProductAttributeValueMapping findById(Integer id);

    void add(ProductAttributeValueMapping entity);

    void update(ProductAttributeValueMapping entity);

    void delete(Integer id);
}
