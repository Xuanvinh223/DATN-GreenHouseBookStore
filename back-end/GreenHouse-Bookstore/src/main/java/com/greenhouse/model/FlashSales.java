package com.greenhouse.model;

import java.io.Serializable;
import java.util.Date;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "FlashSales")
public class FlashSales implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "FlashSaleId")
    private int flashSaleId;

    @Column(name = "Name")
    private String name;

    @Column(name = "Value")
    private int value;

    @Column(name = "StartDate")
    private Date startDate;

    @Column(name = "EndDate")
    private Date endDate;

    @Column(name = "DiscountPercentage")
    private int discountPercentage;

    @Column(name = "Active")
    private boolean active;

    // Các phương thức getters và setters đã được tự động tạo bởi Lombok.
}
