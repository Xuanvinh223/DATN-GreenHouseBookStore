package com.greenhouse.service;

import com.greenhouse.model.Orders;

import java.util.List;

public interface OrdersService {

    List<Orders> findAll();

    Orders findById(Integer orderId);

    void add(Orders entity);

    void update(Orders entity);

    void delete(Integer orderId);
}
