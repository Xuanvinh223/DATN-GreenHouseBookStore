package com.greenhouse.model;

import java.io.Serializable;
import java.util.Date;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "Orders")
public class Orders implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "OrderId")
    private Integer orderId;

    @ManyToOne
    @JoinColumn(name = "InvoiceId")
    private Invoices invoice;

    @ManyToOne
    @JoinColumn(name = "Username")
    private Accounts username;

    @Column(name = "OrderDate")
    private Date orderDate;

    @Column(name = "DeliveryDate")
    private Date deliveryDate;

    @Column(name = "Amount")
    private double amount;

    @ManyToOne
    @JoinColumn(name = "VoucherId")
    private Vouchers voucher;

    @Column(name = "AmountAppliedVoucher")
    private double amountAppliedVoucher;

    @ManyToOne
    @JoinColumn(name = "StatusId")
    private OrderStatus status;

    // Các phương thức getters và setters đã được tự động tạo bởi Lombok.
}
