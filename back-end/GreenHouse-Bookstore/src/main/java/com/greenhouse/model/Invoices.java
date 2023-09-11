package com.greenhouse.model;

import lombok.Data;
import jakarta.persistence.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;

@Data
@Entity
@Table(name = "Invoices")
public class Invoices implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "InvoiceId")
    private int invoiceId;

    @Column(name = "Username")
    private String username;

    @Column(name = "CreateDate")
    private Date createDate;

    @Column(name = "Quantity")
    private int quantity;

    @Column(name = "Amount")
    private BigDecimal amount;

    @Column(name = "AmountAppliedVoucher")
    private BigDecimal amountAppliedVoucher;

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
    @JoinColumn(name = "VoucherId")
    private Vouchers voucher;

    @ManyToOne
    @JoinColumn(name = "PaymentStatusId")
    private PaymentStatus paymentStatus;
}
