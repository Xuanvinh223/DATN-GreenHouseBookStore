package com.greenhouse.implement;

import com.greenhouse.model.Product_Discount;
import com.greenhouse.repository.ProductDiscountRepository;
import com.greenhouse.service.ProductDiscountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductDiscountServiceImpl implements ProductDiscountService {

    @Autowired
    private ProductDiscountRepository productDiscountRepository;

    @Override
    public List<Product_Discount> findAll() {
        return productDiscountRepository.findAll();
    }

    @Override
    public Product_Discount findById(Integer id) {
        Optional<Product_Discount> result = productDiscountRepository.findById(id);
        return result.orElse(null);
    }

    @Override
    public void add(Product_Discount productDiscount) {
        productDiscountRepository.save(productDiscount);
    }

    @Override
    public void update(Product_Discount productDiscount) {
        productDiscountRepository.save(productDiscount);
    }

    @Override
    public void delete(Integer id) {
        productDiscountRepository.deleteById(id);
    }
}
