package com.greenhouse.repository;

import com.greenhouse.model.Orders;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrdersRepository extends JpaRepository<Orders, Integer> {
    // Bạn có thể thêm các phương thức tùy chỉnh khác ở đây nếu cần thiết.
}
