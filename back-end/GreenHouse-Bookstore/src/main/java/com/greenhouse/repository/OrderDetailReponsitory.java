package com.greenhouse.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.greenhouse.model.OrderDetails;
import com.greenhouse.model.Order_Detail;

public interface OrderDetailReponsitory extends JpaRepository<Order_Detail, Integer> {
    List<Order_Detail> findByOrderCode(String orderCode);
}
