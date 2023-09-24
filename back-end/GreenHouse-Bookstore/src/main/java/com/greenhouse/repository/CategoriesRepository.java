package com.greenhouse.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.greenhouse.model.Categories;

public interface CategoriesRepository extends JpaRepository<Categories, String> {
    // Các phương thức truy vấn tùy chỉnh nếu cần
}
