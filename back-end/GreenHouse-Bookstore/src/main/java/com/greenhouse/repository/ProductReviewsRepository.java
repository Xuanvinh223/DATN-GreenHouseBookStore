package com.greenhouse.repository;

import com.greenhouse.model.Product_Reviews;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductReviewsRepository extends JpaRepository<Product_Reviews, Integer> {
    // Bạn có thể thêm các phương thức truy vấn tùy chỉnh ở đây nếu cần.
    List<Product_Reviews> findByProductDetail_ProductDetailId(int productDetailId);
}
