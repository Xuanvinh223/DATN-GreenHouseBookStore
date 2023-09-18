package com.greenhouse.model;

import java.io.Serializable;
import java.util.Date;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "Invoices")
public class Invoices implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "InvoiceId")
    private int invoiceId;

    @ManyToOne
    @JoinColumn(name = "Username")
    private Accounts username;

    @Column(name = "CreateDate")
    private Date createDate;

    @Column(name = "Quantity")
    private int quantity;

    @Column(name = "Amount")
    private double amount;

    @ManyToOne
    @JoinColumn(name = "VoucherId")
    private Vouchers voucher;

    @Column(name = "AmountAppliedVoucher")
    private double amountAppliedVoucher;

    @Column(name = "PaymentMethod")
    private String paymentMethod;

    @Column(name = "PaymentDate")
    private Date paymentDate;

    @Column(name = "ReceiverName")
    private String receiverName;

    @Column(name = "ReceiverPhone")
    private String receiverPhone;

    @Column(name = "ReceiverAddress")
    private String receiverAddress;

    @ManyToOne
    @JoinColumn(name = "PaymentStatusId")
    private PaymentStatus paymentStatus;

    // Các phương thức getters và setters đã được tự động tạo bởi Lombok.
}
