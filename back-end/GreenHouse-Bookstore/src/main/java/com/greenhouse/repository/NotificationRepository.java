package com.greenhouse.repository;

import com.greenhouse.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationRepository extends JpaRepository<Notification, Integer> {
    // Bạn có thể thêm các phương thức tùy chỉnh khác ở đây nếu cần thiết.
}
