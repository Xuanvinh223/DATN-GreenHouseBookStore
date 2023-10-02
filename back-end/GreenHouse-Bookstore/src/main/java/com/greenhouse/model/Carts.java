package com.greenhouse.model;

import java.io.Serializable;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "Carts")
public class Carts implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CartId")
    private int cartId;

    @Column(name = "Quantity")
    private int quantity;

    @Column(name = "Price")
    private double price;

    @Column(name = "Amount")
    private double amount;

    @Column(name = "AmountAppliedDiscount")
    private double amountAppliedDiscount;

    @Column(name = "Status")
    private boolean status;

    // Các phương thức getters và setters đã được tự động tạo bởi Lombok.

    @ManyToOne
    @JoinColumn(name = "Username", referencedColumnName = "Username")
    private Accounts account;

    @ManyToOne
    @JoinColumn(name = "Discount_Id", referencedColumnName = "Discount_Id")
    private Discounts discount;

    @ManyToOne
    private Product_Detail productDetail;

    // Mối quan hệ nếu cần
}
