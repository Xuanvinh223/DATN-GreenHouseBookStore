package com.greenhouse.repository;

import com.greenhouse.model.Authentic_Photos;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AuthenticPhotosRepository extends JpaRepository<Authentic_Photos, Integer> {
    // Các phương thức tùy chỉnh có thể được thêm vào đây nếu cần
}
