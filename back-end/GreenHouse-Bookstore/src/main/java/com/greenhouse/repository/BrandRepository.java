package com.greenhouse.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.greenhouse.model.Brand;

public interface BrandRepository extends JpaRepository<Brand, String> {
    // Các phương thức truy vấn tùy chỉnh nếu cần
}
