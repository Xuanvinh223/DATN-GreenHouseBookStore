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
    @JoinColumn(name = "Flash_Sale_Id")
    private FlashSales flashSale;

    @ManyToOne
    @JoinColumn(name = "Product_Detail_Id")
    private Product_Detail productDetail;

    @Column(name = "Quantity")
    private int quantity;

    @Column(name = "Used_Quantity")
    private int usedQuantity;

    // Các phương thức getters và setters đã được tự động tạo bởi Lombok.
}
