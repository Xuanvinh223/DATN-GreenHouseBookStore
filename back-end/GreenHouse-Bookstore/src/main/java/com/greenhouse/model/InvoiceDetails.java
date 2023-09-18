package com.greenhouse.model;

import java.io.Serializable;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "InvoiceDetails")
public class InvoiceDetails implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "InvoiceDetailId")
    private int invoiceDetailId;

    @ManyToOne
    @JoinColumn(name = "InvoiceId")
    private Invoices invoice;

    @ManyToOne
    @JoinColumn(name = "Discount_Id")
    private Discounts discount;

    @ManyToOne
    @JoinColumn(name = "ProductDetailId")
    private Product_Detail productDetail;

    @Column(name = "Quantity")
    private int quantity;

    @Column(name = "Price")
    private double price;

    @Column(name = "Amount")
    private double amount;

    @Column(name = "AmountAppliedDiscount")
    private double amountAppliedDiscount;

    // Các phương thức getters và setters đã được tự động tạo bởi Lombok.
}
