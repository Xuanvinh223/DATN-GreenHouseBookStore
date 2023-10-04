package com.greenhouse.model;

import java.io.Serializable;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "Shipping_Partners")
public class ShippingPartner implements Serializable {
    @Id
    @Column(name = "ID", unique = true, nullable = false)
    private String id;

    @Column(name = "Name")
    private String name;

    // Các getters và setters đã được tạo tự động (hoặc bạn có thể sử dụng Lombok).

    // Constructors và các methods khác (nếu cần).
}
