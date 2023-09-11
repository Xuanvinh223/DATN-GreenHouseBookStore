package com.greenhouse.model;

import lombok.Data;
import jakarta.persistence.*;
import java.io.Serializable;

@Data
@Entity
@Table(name = "Product_Detail")
public class ProductDetail implements Serializable {
    @Id
    @Column(name = "ProductDetailId")
    private int productDetailId;

    @OneToOne
    @JoinColumn(name = "ProductDetailId")
//    @MapsId
    private Products product;

    @ManyToOne
    @JoinColumn(name = "WeightId")
    private Weight weight;

    @ManyToOne
    @JoinColumn(name = "ColorId")
    private Colors color;

    @ManyToOne
    @JoinColumn(name = "SizeId")
    private Sizes size;

    @ManyToOne
    @JoinColumn(name = "MaterialId")
    private Materials material;

    @ManyToOne
    @JoinColumn(name = "CoverTypeId")
    private CoverTypes coverType;
}
