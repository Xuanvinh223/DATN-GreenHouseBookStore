package com.greenhouse.model;

import lombok.Data;
import jakarta.persistence.*;
import java.io.Serializable;

@Data
@Entity
@Table(name = "Product_Discount")
public class ProductDiscount implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private int id;

    @ManyToOne
    @JoinColumn(name = "DiscountId")
    private Discounts discount;

    @ManyToOne
    @JoinColumn(name = "ProductId")
    private Products product;
}
