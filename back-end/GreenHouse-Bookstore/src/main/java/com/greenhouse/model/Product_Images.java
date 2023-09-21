package com.greenhouse.model;

import java.io.Serializable;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "Product_Images")
public class Product_Images implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id")
    private int id;

    @ManyToOne
    @JoinColumn(name = "ProductDetailId")
    private Product_Detail productDetail;

    @Column(name = "Image", columnDefinition = "nvarchar(200)")
    private String image;

    // Các phương thức getters và setters đã được tự động tạo bởi Lombok.
}