package com.greenhouse.service;

import com.greenhouse.model.Discounts;

import java.util.List;

public interface DiscountsService {

    List<Discounts> findAll();

    Discounts findById(Integer discountId);

    void add(Discounts entity);

    void update(Discounts entity);

    void delete(Integer discountId);
}
