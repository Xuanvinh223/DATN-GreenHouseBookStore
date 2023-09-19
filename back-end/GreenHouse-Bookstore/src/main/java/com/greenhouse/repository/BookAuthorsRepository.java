package com.greenhouse.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.greenhouse.model.Book_Authors;

public interface BookAuthorsRepository extends JpaRepository<Book_Authors, Integer> {
    // Các phương thức truy vấn tùy chỉnh nếu cần
}
