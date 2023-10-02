package com.greenhouse.model;

import java.io.Serializable;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "Product_Detail")
public class Product_Detail implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Product_Detail_Id")
    private int productDetailId;

    @ManyToOne
    @JoinColumn(name = "Product_Id")
    private Products product;

    @Column(name = "Price")
    private double price;

    @Column(name = "Price_discount")
    private double priceDiscount;

    @Column(name = "Quantity_In_Stock")
    private int quantityInStock;

    @Column(name = "Image", columnDefinition = "nvarchar(200)")
    private String image;

    @Column(name = "Product_Image_Id")
    private int productImageId;

    // Các phương thức getters và setters đã được tự động tạo bởi Lombok.
}
