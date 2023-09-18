package com.greenhouse.service.impl;

import com.greenhouse.model.CategoryTypes;
import com.greenhouse.repository.CategoryTypesRepository;
import com.greenhouse.service.CategoryTypesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategoryTypesServiceImpl implements CategoryTypesService {

    @Autowired
    private CategoryTypesRepository categoryTypesRepository;

    @Override
    public List<CategoryTypes> findAll() {
        return categoryTypesRepository.findAll();
    }

    @Override
    public CategoryTypes findById(Integer typeId) {
        Optional<CategoryTypes> result = categoryTypesRepository.findById(typeId);
        return result.orElse(null);
    }

    @Override
    public void add(CategoryTypes categoryType) {
        categoryTypesRepository.save(categoryType);
    }

    @Override
    public void update(CategoryTypes categoryType) {
        categoryTypesRepository.save(categoryType);
    }

    @Override
    public void delete(Integer typeId) {
        categoryTypesRepository.deleteById(typeId);
    }
}
