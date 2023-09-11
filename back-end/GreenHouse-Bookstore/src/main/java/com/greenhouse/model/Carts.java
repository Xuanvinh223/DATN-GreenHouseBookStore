package com.greenhouse.model;

import java.io.Serializable;
import java.math.BigDecimal;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "Carts")
public class Carts implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "OrderId")
    private int orderId;

    @Column(name = "Username")
    private String username;

    @ManyToOne
    @JoinColumn(name = "ProductDetailId")
    private ProductDetail productDetail;

    @Column(name = "Quantity")
    private int quantity;

    @Column(name = "Price")
    private BigDecimal price;

    @Column(name = "Amount")
    private BigDecimal amount;

    @ManyToOne
    @JoinColumn(name = "Discount_Id")
    private Discounts discount;

    @Column(name = "AmountAppliedDiscount")
    private BigDecimal amountAppliedDiscount;

    @Column(name = "Status")
    private boolean status;
}
