package com.greenhouse.service.impl;

import com.greenhouse.model.Carts;
import com.greenhouse.repository.CartsRepository;
import com.greenhouse.service.CartsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CartsServiceImpl implements CartsService {

    @Autowired
    private CartsRepository cartsRepository;

    @Override
    public List<Carts> findAll() {
        return cartsRepository.findAll();
    }

    @Override
    public Carts findById(Integer cartId) {
        Optional<Carts> result = cartsRepository.findById(cartId);
        return result.orElse(null);
    }

    @Override
    public void add(Carts carts) {
        cartsRepository.save(carts);
    }

    @Override
    public void update(Carts carts) {
        cartsRepository.save(carts);
    }

    @Override
    public void delete(Integer cartId) {
        cartsRepository.deleteById(cartId);
    }
}
