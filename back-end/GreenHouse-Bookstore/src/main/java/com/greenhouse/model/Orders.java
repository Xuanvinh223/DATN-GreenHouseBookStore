package com.greenhouse.model;

import lombok.Data;
import jakarta.persistence.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;

@Data
@Entity
@Table(name = "Orders")
public class Orders implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "OrderId")
    private int orderId;

    @ManyToOne
    @JoinColumn(name = "InvoiceId")
    private Invoices invoice;

    @Column(name = "Username")
    private String username;

    @Column(name = "OrderDate")
    private Date orderDate;

    @Column(name = "DeliveryDate")
    private Date deliveryDate;

    @Column(name = "Amount")
    private BigDecimal amount;

    @ManyToOne
    @JoinColumn(name = "VoucherId")
    private Vouchers voucher;

    @Column(name = "AmountAppliedVoucher")
    private BigDecimal amountAppliedVoucher;

    @ManyToOne
    @JoinColumn(name = "StatusId")
    private Status status;
}
