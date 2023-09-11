package com.greenhouse.model;

import lombok.Data;
import jakarta.persistence.*;
import java.io.Serializable;
import java.util.Date;

@Data
@Entity
@Table(name = "Product_Reviews")
public class ProductReviews implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ReviewId")
    private int reviewId;

    @Column(name = "Username")
    private String username;

    @ManyToOne
    @JoinColumn(name = "ProductId")
    private Products product;

    @Column(name = "Comment", columnDefinition = "nvarchar(500)")
    private String comment;

    @Column(name = "Date")
    private Date date;

    @Column(name = "Star")
    private int star;
}
