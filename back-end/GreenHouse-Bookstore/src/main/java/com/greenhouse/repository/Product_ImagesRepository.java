package com.greenhouse.repository;

import com.greenhouse.model.Product_Images;
import org.springframework.data.jpa.repository.JpaRepository;

public interface Product_ImagesRepository extends JpaRepository<Product_Images, Integer> {
    // Bạn có thể thêm các phương thức truy vấn tùy chỉnh ở đây nếu cần.
}
