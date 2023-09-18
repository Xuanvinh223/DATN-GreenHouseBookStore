package com.greenhouse.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.greenhouse.model.InvoiceDetails;

@Repository
public interface InvoiceDetailsRepository extends JpaRepository<InvoiceDetails, Integer> {
    // Các phương thức truy vấn tùy chỉnh có thể được thêm vào đây nếu cần.
}
