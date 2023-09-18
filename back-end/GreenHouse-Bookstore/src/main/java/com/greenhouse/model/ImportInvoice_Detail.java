package com.greenhouse.model;

import java.io.Serializable;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "ImportInvoice_Detail")
public class ImportInvoice_Detail implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id")
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "ImportInvoiceId")
    private ImportInvoice importInvoice;

    @Column(name = "Quantity")
    private Integer quantity;

    @Column(name = "Price")
    private double price;

    @ManyToOne
    @JoinColumn(name = "ProductDetailId")
    private Product_Detail productDetail;

    // Các phương thức getters và setters đã được tự động tạo bởi Lombok.
}
