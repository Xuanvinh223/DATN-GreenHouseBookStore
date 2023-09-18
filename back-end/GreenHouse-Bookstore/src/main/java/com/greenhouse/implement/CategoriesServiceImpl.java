package com.greenhouse.implement;

import com.greenhouse.model.Categories;
import com.greenhouse.repository.CategoriesRepository;
import com.greenhouse.service.CategoriesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategoriesServiceImpl implements CategoriesService {

    @Autowired
    private CategoriesRepository categoriesRepository;

    @Override
    public List<Categories> findAll() {
        return categoriesRepository.findAll();
    }

    @Override
    public Categories findById(Integer categoryId) {
        Optional<Categories> result = categoriesRepository.findById(categoryId);
        return result.orElse(null);
    }

    @Override
    public void add(Categories categories) {
        categoriesRepository.save(categories);
    }

    @Override
    public void update(Categories categories) {
        categoriesRepository.save(categories);
    }

    @Override
    public void delete(Integer categoryId) {
        categoriesRepository.deleteById(categoryId);
    }
}
