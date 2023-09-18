package com.greenhouse.repository;

import com.greenhouse.model.ImportInvoice_Detail;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ImportInvoice_DetailRepository extends JpaRepository<ImportInvoice_Detail, Integer> {
    // Các phương thức truy vấn tùy chỉnh có thể được thêm vào đây nếu cần.
}
