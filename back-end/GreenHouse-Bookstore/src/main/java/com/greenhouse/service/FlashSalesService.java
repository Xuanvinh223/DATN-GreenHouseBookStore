package com.greenhouse.service;

import com.greenhouse.model.FlashSales;

import java.util.List;

public interface FlashSalesService {

    List<FlashSales> findAll();

    FlashSales findById(Integer flashSaleId);

    void add(FlashSales entity);

    void update(FlashSales entity);

    void delete(Integer flashSaleId);

    List<Object[]> findAllFlashSale();
}
