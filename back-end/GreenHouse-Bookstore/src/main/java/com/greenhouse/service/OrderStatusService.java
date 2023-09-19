package com.greenhouse.service;

import com.greenhouse.model.OrderStatus;

import java.util.List;

public interface OrderStatusService {

    List<OrderStatus> findAll();

    OrderStatus findById(Integer statusId);

    void add(OrderStatus entity);

    void update(OrderStatus entity);

    void delete(Integer statusId);
}
