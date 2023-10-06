package com.greenhouse.model;

import java.io.Serializable;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name = "Import_Invoice_Detail")
<<<<<<<< HEAD:back-end/GreenHouse-Bookstore/src/main/java/com/greenhouse/model/ImportInvoice_Detail.java
public class ImportInvoice_Detail implements Serializable {
========
public class ImportInvoiceDetail implements Serializable {
>>>>>>>> dev/minthuc:back-end/GreenHouse-Bookstore/src/main/java/com/greenhouse/model/ImportInvoiceDetail.java

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id")
    private int id;

    @ManyToOne
    @JoinColumn(name = "Import_Invoice_Id")
    private ImportInvoice importInvoice;

    @Column(name = "Quantity")
    private int quantity;

    @Column(name = "Price")
    private double price;

    @ManyToOne
    @JoinColumn(name = "Product_Detail_Id")
    private Product_Detail productDetail;

    // Các phương thức getters và setters đã được tự động tạo bởi Lombok.
}
