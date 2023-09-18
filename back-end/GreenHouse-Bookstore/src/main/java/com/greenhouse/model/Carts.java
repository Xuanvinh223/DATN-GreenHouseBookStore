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
    private Integer cartId;

    @Column(name = "Username")
    private String username;

    @Column(name = "ProductDetailId")
    private Integer productDetailId;

    @Column(name = "Quantity")
    private Integer quantity;

    @Column(name = "Price")
    private double price;

    @Column(name = "Amount")
    private double amount;

    @Column(name = "Discount_Id")
    private Integer discountId;

    @Column(name = "AmountAppliedDiscount")
    private double amountAppliedDiscount;

    @Column(name = "Status")
    private boolean status;

    // Các phương thức getters và setters đã được tự động tạo bởi Lombok.

    @ManyToOne
    @JoinColumn(name = "Username", referencedColumnName = "Username", insertable = false, updatable = false)
    private Accounts account;

    @ManyToOne
    @JoinColumn(name = "Discount_Id", referencedColumnName = "DiscountId", insertable = false, updatable = false)
    private Discounts discount;

    @ManyToOne
    @JoinColumn(name = "ProductDetailId", referencedColumnName = "ProductDetailId", insertable = false, updatable = false)
    private Product_Detail productDetail;

    // Mối quan hệ nếu cần
}
