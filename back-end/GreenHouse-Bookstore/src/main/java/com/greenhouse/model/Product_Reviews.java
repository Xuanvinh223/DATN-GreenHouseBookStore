package com.greenhouse.model;

import java.io.Serializable;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "Product_Reviews")
public class Product_Reviews implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Review_Id")
    private int reviewId;

    @Column(name = "Username", length = 50)
    private String username;

    @ManyToOne
    @JoinColumn(name = "Product_Id")
    private Products product;

    @Column(name = "Comment", columnDefinition = "nvarchar(500)")
    private String comment;

    @Column(name = "Date")
    private java.sql.Timestamp date;

    @Column(name = "Star")
    private int star;

    // Các phương thức getters và setters đã được tự động tạo bởi Lombok.
}
