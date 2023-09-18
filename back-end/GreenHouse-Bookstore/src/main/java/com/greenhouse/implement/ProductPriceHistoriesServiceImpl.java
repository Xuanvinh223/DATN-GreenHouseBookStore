package com.greenhouse.implement;

import com.greenhouse.model.ProductPriceHistories;
import com.greenhouse.repository.ProductPriceHistoriesRepository;
import com.greenhouse.service.ProductPriceHistoriesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductPriceHistoriesServiceImpl implements ProductPriceHistoriesService {

    @Autowired
    private ProductPriceHistoriesRepository productPriceHistoriesRepository;

    @Override
    public List<ProductPriceHistories> findAll() {
        return productPriceHistoriesRepository.findAll();
    }

    @Override
    public ProductPriceHistories findById(Integer priceHistoriesId) {
        Optional<ProductPriceHistories> result = productPriceHistoriesRepository.findById(priceHistoriesId);
        return result.orElse(null);
    }

    @Override
    public void add(ProductPriceHistories entity) {
        productPriceHistoriesRepository.save(entity);
    }

    @Override
    public void update(ProductPriceHistories entity) {
        productPriceHistoriesRepository.save(entity);
    }

    @Override
    public void delete(Integer priceHistoriesId) {
        productPriceHistoriesRepository.deleteById(priceHistoriesId);
    }
}
