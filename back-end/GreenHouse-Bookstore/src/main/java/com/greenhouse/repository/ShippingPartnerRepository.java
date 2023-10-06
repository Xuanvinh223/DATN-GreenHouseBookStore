package com.greenhouse.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.greenhouse.model.ShippingPartner;

@Repository
public interface ShippingPartnerRepository extends JpaRepository<ShippingPartner, String> {
    // Bạn có thể thêm các phương thức tùy chỉnh nếu cần.
}

