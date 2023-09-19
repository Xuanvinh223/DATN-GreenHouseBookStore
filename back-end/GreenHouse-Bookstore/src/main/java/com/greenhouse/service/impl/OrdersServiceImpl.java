package com.greenhouse.service.impl;

import com.greenhouse.model.Orders;
import com.greenhouse.repository.OrdersRepository;
import com.greenhouse.service.OrdersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OrdersServiceImpl implements OrdersService {

    @Autowired
    private OrdersRepository ordersRepository;

    @Override
    public List<Orders> findAll() {
        return ordersRepository.findAll();
    }

    @Override
    public Orders findById(Integer orderId) {
        Optional<Orders> result = ordersRepository.findById(orderId);
        return result.orElse(null);
    }

    @Override
    public void add(Orders orders) {
        ordersRepository.save(orders);
    }

    @Override
    public void update(Orders orders) {
        ordersRepository.save(orders);
    }

    @Override
    public void delete(Integer orderId) {
        ordersRepository.deleteById(orderId);
    }
}
