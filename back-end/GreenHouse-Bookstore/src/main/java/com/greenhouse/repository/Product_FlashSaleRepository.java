package com.greenhouse.repository;

import com.greenhouse.model.Product_Flash_Sale;
import org.springframework.data.jpa.repository.JpaRepository;

public interface Product_FlashSaleRepository extends JpaRepository<Product_Flash_Sale, Integer> {
    // Bạn có thể thêm các phương thức truy vấn tùy chỉnh ở đây nếu cần.
}
