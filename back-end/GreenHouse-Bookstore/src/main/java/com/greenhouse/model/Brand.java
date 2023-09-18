package com.greenhouse.model;

import java.io.Serializable;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "Brand")
public class Brand implements Serializable {

    @Id
    @Column(name = "BrandId")
    private String brandId;

    @Column(name = "BrandName")
    private String brandName;

    @Column(name = "CountryOfOrigin")
    private String countryOfOrigin;

    @Column(name = "Logo")
    private String logo;

    // Các phương thức getters và setters đã được tự động tạo bởi Lombok.

    // Mối quan hệ nếu cần
}
