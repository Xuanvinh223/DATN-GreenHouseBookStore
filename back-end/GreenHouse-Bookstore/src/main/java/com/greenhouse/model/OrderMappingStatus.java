package com.greenhouse.model;

import java.io.Serializable;
import java.util.Date;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "Order_Mapping_Status")
public class OrderMappingStatus implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Status_Order_Id")
    private int statusOrderId;

    @ManyToOne
    @JoinColumn(name = "Order_Id")
    private Orders order;

    @ManyToOne
    @JoinColumn(name = "Status_Id")
    private OrderStatus status;

    @Column(name = "Update_At")
    private Date updateAt;

    // Các phương thức getters và setters đã được tự động tạo bởi Lombok.
}
