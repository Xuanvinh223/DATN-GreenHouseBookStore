package com.greenhouse.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.greenhouse.model.Order_Detail;

public interface OrderDetailReponsitory extends JpaRepository<Order_Detail, Integer>{
    
}
