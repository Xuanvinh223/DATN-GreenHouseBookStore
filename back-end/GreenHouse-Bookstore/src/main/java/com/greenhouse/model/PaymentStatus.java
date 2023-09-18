package com.greenhouse.model;

import java.io.Serializable;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "PaymentStatus")
public class PaymentStatus implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "StatusId")
    private Integer statusId;

    @Column(name = "Name", columnDefinition = "nvarchar(50)")
    private String name;

    // Các phương thức getters và setters đã được tự động tạo bởi Lombok.
}
