package com.greenhouse.model;

import lombok.Data;
import jakarta.persistence.*;
import java.io.Serializable;
import java.math.BigDecimal;

@Data
@Entity
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
}
