package com.greenhouse.model;

import java.io.Serializable;
import java.util.Date;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "OrderMappingStatus")
public class OrderMappingStatus implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "StatusOrderId")
    private int statusOrderId;

    @ManyToOne
    @JoinColumn(name = "OrderId")
    private Orders order;

    @ManyToOne
    @JoinColumn(name = "StatusId")
    private OrderStatus status;

    @Column(name = "UpdateAt")
    private Date updateAt;

    // Các phương thức getters và setters đã được tự động tạo bởi Lombok.
}
