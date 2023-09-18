package com.greenhouse.model;

import java.io.Serializable;
import java.util.Date;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "InvoiceMappingStatus")
public class InvoiceMappingStatus implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "InvoiceOrderStatusId")
    private int invoiceOrderStatusId;

    @ManyToOne
    @JoinColumn(name = "InvoiceId")
    private Invoices invoice;

    @ManyToOne
    @JoinColumn(name = "PaymentStatusId")
    private PaymentStatus paymentStatus;

    @Column(name = "UpdateAt")
    private Date updateAt;

    // Các phương thức getters và setters đã được tự động tạo bởi Lombok.
}
