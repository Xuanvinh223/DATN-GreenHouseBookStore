package com.greenhouse.implement;

import com.greenhouse.model.OrderMappingStatus;
import com.greenhouse.repository.OrderMappingStatusRepository;
import com.greenhouse.service.OrderMappingStatusService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OrderMappingStatusServiceImpl implements OrderMappingStatusService {

    @Autowired
    private OrderMappingStatusRepository orderMappingStatusRepository;

    @Override
    public List<OrderMappingStatus> findAll() {
        return orderMappingStatusRepository.findAll();
    }

    @Override
    public OrderMappingStatus findById(Integer statusOrderId) {
        Optional<OrderMappingStatus> result = orderMappingStatusRepository.findById(statusOrderId);
        return result.orElse(null);
    }

    @Override
    public void add(OrderMappingStatus orderMappingStatus) {
        orderMappingStatusRepository.save(orderMappingStatus);
    }

    @Override
    public void update(OrderMappingStatus orderMappingStatus) {
        orderMappingStatusRepository.save(orderMappingStatus);
    }

    @Override
    public void delete(Integer statusOrderId) {
        orderMappingStatusRepository.deleteById(statusOrderId);
    }
}
