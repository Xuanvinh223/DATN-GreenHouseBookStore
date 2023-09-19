package com.greenhouse.model;

import java.io.Serializable;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "Authentic_Photos")
@Data
public class Authentic_Photos implements Serializable {

    @Id
    @Column(name = "AuthenticPhotoId")
    private int authenticPhotoId;

    @Column(name = "PhotoName")
    private String photoName;

    @Column(name = "ProductReviewId")
    private int productReviewId;

    @ManyToOne
    @JoinColumn(name = "ProductReviewId", referencedColumnName = "ReviewId", insertable = false, updatable = false)
    private Product_Reviews productReview;

    // Getters and setters
}
