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
    @Column(name = "Discount_Id")
    private int discountId;

    @Column(name = "Value")
    private Integer value;

    @Column(name = "Start_Date")
    private Date startDate;

    @Column(name = "End_Date")
    private Date endDate;

    @Column(name = "Quantity")
    private Integer quantity;

    @Column(name = "Used_Quantity")
    private Integer usedQuantity;

    @Column(name = "Active")
    private boolean active;

    // Các phương thức getters và setters đã được tự động tạo bởi Lombok.
}
