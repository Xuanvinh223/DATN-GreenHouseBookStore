package com.greenhouse.model;

import java.io.Serializable;
import java.util.Date;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "ImportInvoice")
public class ImportInvoice implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ImportInvoiceId")
    private Integer importInvoiceId;

    @Column(name = "Username")
    private String username;

    @Column(name = "CreateDate")
    private Date createDate;

    @Column(name = "Amount")
    private double amount;

    @Column(name = "SupplierId")
    private String supplierId;

    @Column(name = "Status")
    private boolean status;

    // Các phương thức getters và setters đã được tự động tạo bởi Lombok.
}
