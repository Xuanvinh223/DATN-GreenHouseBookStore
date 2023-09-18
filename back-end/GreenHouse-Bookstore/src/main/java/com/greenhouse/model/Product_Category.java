package com.greenhouse.model;

import java.io.Serializable;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "Product_Category")
public class Product_Category implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id")
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "ProductId")
    private Products product;

    @ManyToOne
    @JoinColumn(name = "CategoryId")
    private Categories category;

    // Các phương thức getters và setters đã được tự động tạo bởi Lombok.
}
