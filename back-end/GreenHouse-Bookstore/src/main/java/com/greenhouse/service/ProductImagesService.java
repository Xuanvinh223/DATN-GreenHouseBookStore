package com.greenhouse.service;

import com.greenhouse.model.Product_Images;

import java.util.List;

public interface ProductImagesService {

    List<Product_Images> findAll();

    Product_Images findById(Integer id);

    Product_Images add(Product_Images entity);

    Product_Images update(Product_Images entity);

    void delete(Integer id);
}
