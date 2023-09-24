package com.greenhouse.repository;

import com.greenhouse.model.CategoryTypes;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryTypesRepository extends JpaRepository<CategoryTypes, String> {
    // Các phương thức truy vấn tùy chỉnh có thể được thêm vào đây nếu cần.
}
