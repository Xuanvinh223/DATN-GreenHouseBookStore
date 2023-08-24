package com.greenhouse.model;

import lombok.Data;
import jakarta.persistence.*;
import java.io.Serializable;
import java.util.List;

@Data
@Entity
@Table(name = "Publishers")
public class Publishers implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "PublisherId")
    private int publisherId;

    @Column(name = "PublisherName")
    private String publisherName;

    @Column(name = "Description", columnDefinition = "nvarchar(200)")
    private String description;

    @Column(name = "Address", columnDefinition = "nvarchar(200)")
    private String address;

    @Column(name = "Email")
    private String email;

    @Column(name = "Image", columnDefinition = "nvarchar(200)")
    private String image;

    @OneToMany(mappedBy = "publisher")
    private List<Products> products;
}
