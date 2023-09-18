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
    @Column(name = "ProductDetailId")
    private Integer productDetailId;

    @ManyToOne
    @JoinColumn(name = "ProductId")
    private Products product;

    @Column(name = "Price")
    private double price;

    @Column(name = "QuantityInStock")
    private Integer quantityInStock;

    @Column(name = "Image", columnDefinition = "nvarchar(200)")
    private String image;

    @Column(name = "ProductImageId")
    private Integer productImageId;

    // Các phương thức getters và setters đã được tự động tạo bởi Lombok.
}
