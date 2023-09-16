package com.greenhouse.model;

import java.io.Serializable;
import java.util.Date;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "ProductPriceHistories")
public class ProductPriceHistories implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "PriceHistoriesId")
    private int priceHistoriesId;

    @Column(name = "Username", length = 50)
    private String username;

    @ManyToOne
    @JoinColumn(name = "ProductDetailId")
    private Product_Detail productDetail;

    @Column(name = "PriceOld")
    private double priceOld;

    @Column(name = "PriceNew")
    private double priceNew;

    @Column(name = "TimeChange")
   private Date  timeChange;

    // Các phương thức getters và setters đã được tự động tạo bởi Lombok.
}
