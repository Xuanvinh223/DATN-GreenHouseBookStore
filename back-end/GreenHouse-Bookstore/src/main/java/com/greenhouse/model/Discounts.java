package com.greenhouse.model;

import java.io.Serializable;
import java.util.Date;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "Discounts")
public class Discounts implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "DiscountId")
    private int discountId;

    @Column(name = "Value")
    private int value;

    @Column(name = "StartDate")
    private Date startDate;

    @Column(name = "EndDate")
    private Date endDate;

    @Column(name = "Quantity")
    private int quantity;

    @Column(name = "UsedQuantity")
    private int usedQuantity;

    @Column(name = "Active")
    private boolean active;

    // Các phương thức getters và setters đã được tự động tạo bởi Lombok.
}
