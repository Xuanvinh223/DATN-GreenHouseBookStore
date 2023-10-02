package com.greenhouse.repository;

import com.greenhouse.model.Products;


import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductsRepository extends JpaRepository<Products, String> {
    // Các phương thức truy vấn tùy chỉnh nếu cần
}
