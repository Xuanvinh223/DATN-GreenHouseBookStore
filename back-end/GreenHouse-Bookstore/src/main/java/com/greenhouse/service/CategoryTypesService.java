package com.greenhouse.service;

import com.greenhouse.model.CategoryTypes;

import java.util.List;

public interface CategoryTypesService {

    List<CategoryTypes> findAll();

    CategoryTypes findById(Integer typeId);

    void add(CategoryTypes entity);

    void update(CategoryTypes entity);

    void delete(Integer typeId);
}
