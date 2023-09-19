package com.greenhouse.service;

import com.greenhouse.model.ProductPriceHistories;

import java.util.List;

public interface ProductPriceHistoriesService {

    List<ProductPriceHistories> findAll();

    ProductPriceHistories findById(Integer priceHistoriesId);

    void add(ProductPriceHistories entity);

    void update(ProductPriceHistories entity);

    void delete(Integer priceHistoriesId);
}
