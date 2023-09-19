package com.greenhouse.service;

import com.greenhouse.model.Categories;

import java.util.List;

public interface CategoriesService {

    List<Categories> findAll();

    Categories findById(Integer categoryId);

    void add(Categories entity);

    void update(Categories entity);

    void delete(Integer categoryId);
}
