package com.greenhouse.service.impl;

import com.greenhouse.model.Brand;
import com.greenhouse.repository.BrandRepository;
import com.greenhouse.service.BrandService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BrandServiceImpl implements BrandService {

    @Autowired
    private BrandRepository brandRepository;

    @Override
    public List<Brand> findAll() {
        return brandRepository.findAll();
    }

    @Override
    public Brand findById(String brandId) {
        Optional<Brand> result = brandRepository.findById(brandId);
        return result.orElse(null);
    }

    @Override
    public Brand add(Brand brand) {
       return brandRepository.save(brand);
    }

    @Override
    public void update(Brand brand) {
        brandRepository.save(brand);
    }

    @Override
    public void delete(String brandId) {
        brandRepository.deleteById(brandId);
    }
}
