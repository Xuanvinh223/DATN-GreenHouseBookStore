package com.greenhouse.repository;

import com.greenhouse.model.Product_Discount;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductDiscountRepository extends JpaRepository<Product_Discount, Integer> {
    // Các phương thức truy vấn tùy chỉnh (nếu cần) có thể được thêm vào đây.
}
