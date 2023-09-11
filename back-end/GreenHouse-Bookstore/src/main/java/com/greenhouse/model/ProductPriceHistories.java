package com.greenhouse.model;

import lombok.Data;
import jakarta.persistence.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;

@Data
@Entity
@Table(name = "ProductPriceHistories")
public class ProductPriceHistories implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "PriceHistoriesId")
    private int priceHistoriesId;

    @Column(name = "Username")
    private String username;

    @ManyToOne
    @JoinColumn(name = "ProductId")
    private Products product;

    @Column(name = "PriceOld")
    private BigDecimal priceOld;

    @Column(name = "PriceNew")
    private BigDecimal priceNew;

    @Column(name = "TimeChange")
    private Date timeChange;
}
