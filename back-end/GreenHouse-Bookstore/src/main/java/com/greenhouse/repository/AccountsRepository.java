package com.greenhouse.repository;

import com.greenhouse.model.Accounts;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AccountsRepository extends JpaRepository<Accounts, String> {
    // Các phương thức tùy chỉnh có thể được thêm vào đây nếu cần
}
