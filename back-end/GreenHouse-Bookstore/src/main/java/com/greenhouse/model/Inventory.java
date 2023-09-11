package com.greenhouse.model;

import lombok.Data;
import jakarta.persistence.*;
import java.io.Serializable;

@Data
@Entity
@Table(name = "Inventory")
public class Inventory implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "InventoryId")
    private int inventoryId;

    @Column(name = "QuantityInStock")
    private int quantityInStock;

    @ManyToOne
    @JoinColumn(name = "ProductDetailId")
    private ProductDetail productDetail;
}

