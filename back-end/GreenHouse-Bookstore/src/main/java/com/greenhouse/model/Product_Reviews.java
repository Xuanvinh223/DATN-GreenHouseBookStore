package com.greenhouse.model;

import java.io.Serializable;
import java.util.Date;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "Product_Reviews")
public class Product_Reviews implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Review_Id")
    private int reviewId;

    @ManyToOne
    @JoinColumn(name = "Username")
    private Accounts account;

    @ManyToOne
    @JoinColumn(name = "Product_Id")
    private Products product;

    @Column(name = "Comment")
    private String comment;

    @Column(name = "Date")
    private Date date;

    @Column(name = "Star")
    private int star;

    // Constructors, getters, and setters.
}
