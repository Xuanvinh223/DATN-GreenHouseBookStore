package com.greenhouse.implement;

import com.greenhouse.model.Product_Images;
import com.greenhouse.repository.Product_ImagesRepository;
import com.greenhouse.service.ProductImagesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductImagesServiceImpl implements ProductImagesService {

    @Autowired
    private Product_ImagesRepository productImagesRepository;

    @Override
    public List<Product_Images> findAll() {
        return productImagesRepository.findAll();
    }

    @Override
    public Product_Images findById(Integer id) {
        Optional<Product_Images> result = productImagesRepository.findById(id);
        return result.orElse(null);
    }

    @Override
    public void add(Product_Images productImages) {
        productImagesRepository.save(productImages);
    }

    @Override
    public void update(Product_Images productImages) {
        productImagesRepository.save(productImages);
    }

    @Override
    public void delete(Integer id) {
        productImagesRepository.deleteById(id);
    }
}
