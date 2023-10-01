package com.greenhouse.service;

import com.greenhouse.model.Flash_Sales;
import com.greenhouse.model.Product_Flash_Sale;

import java.util.List;

public interface FlashSalesService {

    List<Flash_Sales> findAll();

    Flash_Sales findById(Integer flashSaleId);

    void add(Flash_Sales entity);

    void update(Flash_Sales entity);

    void delete(Integer flashSaleId);

    List<Object[]> findAllFlashSale();

    List<Object[]> findProductsByStatus();
}
