package com.greenhouse.service;

import com.greenhouse.model.ProductAttributeValueMapping;

import java.util.List;

public interface ProductAttributeValueMappingService {

    List<ProductAttributeValueMapping> findAll();

    ProductAttributeValueMapping findById(Integer id);

    ProductAttributeValueMapping add(ProductAttributeValueMapping entity);

    ProductAttributeValueMapping update(ProductAttributeValueMapping entity);

    void delete(Integer id);
}
