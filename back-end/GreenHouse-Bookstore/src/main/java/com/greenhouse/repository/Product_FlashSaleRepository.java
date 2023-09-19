package com.greenhouse.repository;

import com.greenhouse.model.Product_FlashSale;
import org.springframework.data.jpa.repository.JpaRepository;

public interface Product_FlashSaleRepository extends JpaRepository<Product_FlashSale, Integer> {
    // Bạn có thể thêm các phương thức truy vấn tùy chỉnh ở đây nếu cần.
}
