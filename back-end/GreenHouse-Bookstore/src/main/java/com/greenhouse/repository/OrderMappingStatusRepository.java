package com.greenhouse.repository;

import com.greenhouse.model.OrderMappingStatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderMappingStatusRepository extends JpaRepository<OrderMappingStatus, Integer> {
    // Bạn có thể thêm các phương thức tùy chỉnh khác ở đây nếu cần thiết.
}
