package com.greenhouse.service.impl;

import com.greenhouse.model.OrderStatus;
import com.greenhouse.repository.OrderStatusRepository;
import com.greenhouse.service.OrderStatusService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OrderStatusServiceImpl implements OrderStatusService {

    @Autowired
    private OrderStatusRepository orderStatusRepository;

    @Override
    public List<OrderStatus> findAll() {
        return orderStatusRepository.findAll();
    }

    @Override
    public OrderStatus findById(Integer statusId) {
        Optional<OrderStatus> result = orderStatusRepository.findById(statusId);
        return result.orElse(null);
    }

    @Override
    public void add(OrderStatus orderStatus) {
        orderStatusRepository.save(orderStatus);
    }

    @Override
    public void update(OrderStatus orderStatus) {
        orderStatusRepository.save(orderStatus);
    }

    @Override
    public void delete(Integer statusId) {
        orderStatusRepository.deleteById(statusId);
    }
}
