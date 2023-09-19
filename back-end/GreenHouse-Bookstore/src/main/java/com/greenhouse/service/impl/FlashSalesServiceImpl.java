package com.greenhouse.service.impl;

import com.greenhouse.model.FlashSales;
import com.greenhouse.repository.FlashSalesRepository;
import com.greenhouse.service.FlashSalesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FlashSalesServiceImpl implements FlashSalesService {

    @Autowired
    private FlashSalesRepository flashSalesRepository;

    @Override
    public List<FlashSales> findAll() {
        return flashSalesRepository.findAll();
    }

    @Override
    public FlashSales findById(Integer flashSaleId) {
        Optional<FlashSales> result = flashSalesRepository.findById(flashSaleId);
        return result.orElse(null);
    }

    @Override
    public void add(FlashSales flashSales) {
        flashSalesRepository.save(flashSales);
    }

    @Override
    public void update(FlashSales flashSales) {
        flashSalesRepository.save(flashSales);
    }

    @Override
    public void delete(Integer flashSaleId) {
        flashSalesRepository.deleteById(flashSaleId);
    }
}
