package com.greenhouse.model;
import java.io.Serializable;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "Brand")
@Data   
public class Brand implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "BrandId")
    private int brandId;

    @Column(name = "BrandName")
    private String brandName;

    @Column(name = "CountryOfOrigin")
    private String countryOfOrigin;

    @Column(name = "Logo")
    private String logo;

    // Constructors, getters, setters...
}
