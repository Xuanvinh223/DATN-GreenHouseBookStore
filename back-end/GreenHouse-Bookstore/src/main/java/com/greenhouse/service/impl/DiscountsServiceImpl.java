package com.greenhouse.service.impl;

import com.greenhouse.model.Discounts;
import com.greenhouse.repository.DiscountsRepository;
import com.greenhouse.service.DiscountsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DiscountsServiceImpl implements DiscountsService {

    @Autowired
    private DiscountsRepository discountsRepository;

    @Override
    public List<Discounts> findAll() {
        return discountsRepository.findAll();
    }

    @Override
    public Discounts findById(Integer discountId) {
        Optional<Discounts> result = discountsRepository.findById(discountId);
        return result.orElse(null);
    }

    @Override
    public void add(Discounts discounts) {
        discountsRepository.save(discounts);
    }

    @Override
    public void update(Discounts discounts) {
        discountsRepository.save(discounts);
    }

    @Override
    public void delete(Integer discountId) {
        discountsRepository.deleteById(discountId);
    }
}
