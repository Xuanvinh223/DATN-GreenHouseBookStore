package com.greenhouse.model;

import java.io.Serializable;
import java.util.Date;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "Products")
public class Products implements Serializable {

    @Id
    @Column(name = "ProductId", length = 30)
    private String productId;

    @Column(name = "ProductName", columnDefinition = "nvarchar(100)", nullable = false)
    private String productName;

    @Column(name = "Description", columnDefinition = "nvarchar(200)")
    private String description;

    @Column(name = "Image", columnDefinition = "nvarchar(200)")
    private String image;

    @Column(name = "ManufactureDate", nullable = false)
    private Date manufactureDate;

    @Column(name = "status", nullable = false)
    private boolean status;

    @Column(name = "CreateAt")
    private Date createAt;

    @Column(name = "DeleteAt")
    private Date deleteAt;

    @Column(name = "DeleteBy", length = 200)
    private String deleteBy;

    @Column(name = "UpdateAt")
    private Date updateAt;

    @Column(name = "BrandId", length = 30, nullable = false)
    private String brandId;

    @Column(name = "PushlisherId", length = 30, nullable = false)
    private String publisherId;

    @ManyToOne
    @JoinColumn(name = "BrandId", insertable = false, updatable = false)
    private Brand brand;

    @ManyToOne
    @JoinColumn(name = "PushlisherId", insertable = false, updatable = false)
    private Publishers publisher;

    // Các phương thức getters và setters đã được tự động tạo bởi Lombok.
}
