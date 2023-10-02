package com.greenhouse.service;

import com.greenhouse.model.Product_Category;

import java.util.List;

public interface ProductCategoryService {

    List<Product_Category> findAll();

    Product_Category findById(Integer id);

    Product_Category add(Product_Category entity);

    Product_Category update(Product_Category entity);

    void delete(Integer id);
}
