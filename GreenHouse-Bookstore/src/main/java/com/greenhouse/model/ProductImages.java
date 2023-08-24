package com.greenhouse.model;

import lombok.Data;
import jakarta.persistence.*;
import java.io.Serializable;

@Data
@Entity
@Table(name = "Product_Images")
public class ProductImages implements Serializable {
    @Id
    @Column(name = "Id")
    private int id;

    @ManyToOne
    @JoinColumn(name = "ProductId")
    private Products product;

    @Column(name = "Image", columnDefinition = "nvarchar(200)")
    private String image;
}
