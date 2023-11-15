package com.greenhouse.repository;

import com.greenhouse.model.AttributeValue;
import com.greenhouse.model.Product_Detail;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AttributeValueRepository extends JpaRepository<AttributeValue, Integer> {
    // Các phương thức tùy chỉnh có thể được thêm vào đây nếu cần
    List<AttributeValue> findByProductDetail(Product_Detail productDetail);
}
