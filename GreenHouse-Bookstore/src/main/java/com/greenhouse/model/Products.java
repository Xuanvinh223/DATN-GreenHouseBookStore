package com.greenhouse.model;

import lombok.Data;
import jakarta.persistence.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

@Data
@Entity
@Table(name = "Products")
public class Products implements Serializable {
    @Id
    @Column(name = "ProductId")
    private int productId;

    @Column(name = "ProductName")
    private String productName;

    @Column(name = "Price")
    private BigDecimal price;

    @Column(name = "Description", columnDefinition = "nvarchar(200)")
    private String description;

    @Column(name = "Image", columnDefinition = "nvarchar(200)")
    private String image;

    @Column(name = "ManufactureDate")
    private Date manufactureDate;

    @Column(name = "ExpiryDate")
    private Date expiryDate;

    @Column(name = "CreateAt")
    private Date createAt;

    @Column(name = "DeleteAt")
    private Date deleteAt;

    @Column(name = "DeleteBy", columnDefinition = "varchar(200)")
    private String deleteBy;

    @Column(name = "UpdateAt")
    private Date updateAt;

    @ManyToOne
    @JoinColumn(name = "BrandId")
    private Brand brand;

    @OneToMany(mappedBy = "product")
    private List<ProductImages> images;
}
