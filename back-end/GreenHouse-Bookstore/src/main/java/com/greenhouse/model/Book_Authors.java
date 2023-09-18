package com.greenhouse.model;

import java.io.Serializable;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "Book_Authors")
public class Book_Authors implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id")
    private int id;

    @Column(name = "AuthorId")
    private String authorId;

    @Column(name = "ProductId")
    private String productId;

    // Các phương thức getters và setters đã được tự động tạo bởi Lombok.

    @ManyToOne
    @JoinColumn(name = "AuthorId", referencedColumnName = "AuthorId", insertable = false, updatable = false)
    private Authors author;

    @ManyToOne
    @JoinColumn(name = "ProductId", referencedColumnName = "ProductId", insertable = false, updatable = false)
    private Products product;

    // Mối quan hệ nếu cần
}
