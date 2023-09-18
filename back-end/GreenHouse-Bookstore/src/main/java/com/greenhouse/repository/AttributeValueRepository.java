package com.greenhouse.repository;

import com.greenhouse.model.AttributeValue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AttributeValueRepository extends JpaRepository<AttributeValue, Integer> {
    // Các phương thức tùy chỉnh có thể được thêm vào đây nếu cần
}
