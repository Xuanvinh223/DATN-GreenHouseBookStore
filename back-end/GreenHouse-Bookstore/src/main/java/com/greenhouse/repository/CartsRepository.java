package com.greenhouse.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.greenhouse.model.Carts;

public interface CartsRepository extends JpaRepository<Carts, Integer> {
    // Các phương thức truy vấn tùy chỉnh nếu cần
}
