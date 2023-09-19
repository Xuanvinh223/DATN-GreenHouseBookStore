package com.greenhouse.model;

import java.io.Serializable;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "Product_FlashSale")
public class Product_FlashSale implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private int id;

    @ManyToOne
    @JoinColumn(name = "FlashSaleId")
    private FlashSales flashSale;

    @ManyToOne
    @JoinColumn(name = "ProductDetailId")
    private Product_Detail productDetail;

    @Column(name = "Quantity")
    private int quantity;

    @Column(name = "UsedQuantity")
    private int usedQuantity;

    // Các phương thức getters và setters đã được tự động tạo bởi Lombok.
}
