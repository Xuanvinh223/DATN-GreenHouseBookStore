package com.greenhouse.repository;

import com.greenhouse.model.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderStatusRepository extends JpaRepository<OrderStatus, Integer> {
    // Bạn có thể thêm các phương thức tùy chỉnh khác ở đây nếu cần thiết.
}
