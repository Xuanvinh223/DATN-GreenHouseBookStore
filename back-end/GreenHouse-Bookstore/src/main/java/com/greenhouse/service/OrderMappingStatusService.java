package com.greenhouse.service;

import com.greenhouse.model.OrderMappingStatus;

import java.util.List;

public interface OrderMappingStatusService {

    List<OrderMappingStatus> findAll();

    OrderMappingStatus findById(Integer statusOrderId);

    void add(OrderMappingStatus entity);

    void update(OrderMappingStatus entity);

    void delete(Integer statusOrderId);
}
