package com.greenhouse.repository;

import com.greenhouse.model.FlashSales;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FlashSalesRepository extends JpaRepository<FlashSales, Integer> {
    // Các phương thức truy vấn tùy chỉnh có thể được thêm vào đây nếu cần.
}
