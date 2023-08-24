package com.greenhouse.model;

import java.io.Serializable;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "Authentic_Photos")
@Data
public class AuthenticPhotos implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "AuthenticPhotoId")
    private int authenticPhotoId;

    @Column(name = "PhotoName")
    private String photoName;

    @ManyToOne
    @JoinColumn(name = "ProductReviewId")
    private ProductReviews productReview;

    // Constructors, getters, setters...
}
