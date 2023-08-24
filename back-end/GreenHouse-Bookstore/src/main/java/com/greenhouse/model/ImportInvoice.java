package com.greenhouse.model;

import lombok.Data;
import jakarta.persistence.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;

@Data
@Entity
@Table(name = "ImportInvoice")
public class ImportInvoice implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ImportInvoiceId")
    private int importInvoiceId;

    @Column(name = "Username")
    private String username;

    @Column(name = "CreatedBy")
    private String createdBy;

    @Column(name = "CreateDate")
    private Date createDate;

    @Column(name = "PaymentMethod")
    private String paymentMethod;

    @Column(name = "PaymentDate")
    private Date paymentDate;

    @Column(name = "Quantity")
    private int quantity;

    @Column(name = "Amount")
    private BigDecimal amount;

    @ManyToOne
    @JoinColumn(name = "SupplierId")
    private Suppliers supplier;
}
