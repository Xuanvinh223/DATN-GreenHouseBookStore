package com.greenhouse.repository;

import com.greenhouse.model.Product_Detail;
import com.greenhouse.model.Products;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ProductDetailRepository extends JpaRepository<Product_Detail, Integer> {
    // Các phương thức truy vấn tùy chỉnh (nếu cần) có thể được thêm vào đây.

    @Query(value = "SELECT d.* FROM Product_Detail d join Products p on d.Product_Id = p.Product_Id " +
            "WHERE p.Status = 1", nativeQuery = true)
    List<Product_Detail> findProductsByStatus();
}
