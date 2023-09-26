package com.greenhouse.service;

import com.greenhouse.model.Brand;

import java.util.List;

public interface BrandService {

    List<Brand> findAll();

    Brand findById(String brandId);

    Brand add(Brand entity);

    void update(Brand entity);

    void delete(String brandId);
}
