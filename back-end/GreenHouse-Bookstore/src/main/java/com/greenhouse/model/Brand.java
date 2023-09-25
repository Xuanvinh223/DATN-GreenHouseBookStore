package com.greenhouse.model;

import java.io.Serializable;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "Brand")
public class Brand implements Serializable {

    @Id
    @Column(name = "brand_id")
    private String brandId;

    @Column(name = "brand_name")
    private String brandName;

    @Column(name = "country_of_origin")
    private String countryOfOrigin;

    @Column(name = "Logo")
    private String logo;

    // Mối quan hệ nếu cần
}
