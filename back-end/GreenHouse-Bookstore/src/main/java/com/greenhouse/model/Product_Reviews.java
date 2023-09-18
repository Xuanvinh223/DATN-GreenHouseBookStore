package com.greenhouse.model;

import java.io.Serializable;
import java.util.Date;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "Product_Reviews")
public class Product_Reviews implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ReviewId")
    private Integer reviewId;

    @Column(name = "Username", length = 50)
    private String username;

    @ManyToOne
    @JoinColumn(name = "ProductId")
    private Products product;

    @Column(name = "Comment", columnDefinition = "nvarchar(500)")
    private String comment;

    @Column(name = "Date")
    private Date date;

    @Column(name = "Star")
    private Integer star;

    // Các phương thức getters và setters đã được tự động tạo bởi Lombok.
}
