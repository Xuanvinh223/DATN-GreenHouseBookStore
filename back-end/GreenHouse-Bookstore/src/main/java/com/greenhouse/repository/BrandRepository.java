package com.greenhouse.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.greenhouse.model.Brands;

public interface BrandRepository extends JpaRepository<Brands, String> {
    // Các phương thức truy vấn tùy chỉnh nếu cần
}
