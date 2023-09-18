package com.greenhouse.repository;

import com.greenhouse.model.ProductAttributeValueMapping;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductAttributeValueMappingRepository extends JpaRepository<ProductAttributeValueMapping, Integer> {
    // Bạn có thể thêm các phương thức truy vấn tùy chỉnh ở đây nếu cần.
}
