package com.greenhouse.repository;

import com.greenhouse.model.Orders;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface OrdersRepository extends JpaRepository<Orders, String> {
    // Bạn có thể thêm các phương thức tùy chỉnh khác ở đây nếu cần thiết.
    List<Orders> findByUsername(String username);
}
