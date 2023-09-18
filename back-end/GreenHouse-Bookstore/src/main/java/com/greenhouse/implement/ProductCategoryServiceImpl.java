package com.greenhouse.implement;

import com.greenhouse.model.Product_Category;
import com.greenhouse.repository.ProductCategoryRepository;
import com.greenhouse.service.ProductCategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductCategoryServiceImpl implements ProductCategoryService {

    @Autowired
    private ProductCategoryRepository productCategoryRepository;

    @Override
    public List<Product_Category> findAll() {
        return productCategoryRepository.findAll();
    }

    @Override
    public Product_Category findById(Integer id) {
        Optional<Product_Category> result = productCategoryRepository.findById(id);
        return result.orElse(null);
    }

    @Override
    public void add(Product_Category productCategory) {
        productCategoryRepository.save(productCategory);
    }

    @Override
    public void update(Product_Category productCategory) {
        productCategoryRepository.save(productCategory);
    }

    @Override
    public void delete(Integer id) {
        productCategoryRepository.deleteById(id);
    }
}
