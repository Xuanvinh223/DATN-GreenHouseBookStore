package com.greenhouse.model;

import lombok.Data;
import jakarta.persistence.*;
import java.io.Serializable;
import java.util.Date;

@Data
@Entity
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
}
