package com.greenhouse.model;

import java.io.Serializable;
import java.util.List;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "Publishers")
public class Publishers implements Serializable {

    @Id
    @Column(name = "PublisherId", length = 30)
    private String publisherId;

    @Column(name = "PublisherName", columnDefinition = "nvarchar(100)", nullable = false)
    private String publisherName;

    @Column(name = "Description", columnDefinition = "nvarchar(200)")
    private String description;

    @Column(name = "Address", columnDefinition = "nvarchar(200)", nullable = false)
    private String address;

    @Column(name = "Email", length = 50, nullable = false)
    private String email;

    @Column(name = "Image", columnDefinition = "nvarchar(200)")
    private String image;

    @OneToMany(mappedBy = "publisher")
    private List<Products> products;

    // Các phương thức getters và setters đã được tự động tạo bởi Lombok.
}
