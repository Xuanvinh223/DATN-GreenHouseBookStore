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
    @Column(name = "Invoice_Id")
    private int invoiceId;

    @ManyToOne
    @JoinColumn(name = "Username")
    private Accounts username;

    @Column(name = "Create_Date")
    private Date createDate;

    @Column(name = "Create_By")
    private String createBy;

    @Column(name = "Quantity")
    private int quantity;

    @Column(name = "Total_Amount")
    private double totalAmount;

    @Column(name = "Shipping_Partner")
    private String shippingPartner;

    @Column(name = "Shipping_Fee")
    private double shippingFee;

    @Column(name = "Payment_Amount")
    private double paymentAmount;

    @Column(name = "Payment_Method")
    private String paymentMethod;

    @Column(name = "Bank_Code")
    private String bankCode;

    @Column(name = "Payment_Date")
    private Date paymentDate;

    @Column(name = "ReceiverName")
    private String receiverName;

    @Column(name = "ReceiverPhone")
    private String receiverPhone;

    @Column(name = "ReceiverAddress")
    private String receiverAddress;

    // Các phương thức getters và setters đã được tự động tạo bởi Lombok.
}
