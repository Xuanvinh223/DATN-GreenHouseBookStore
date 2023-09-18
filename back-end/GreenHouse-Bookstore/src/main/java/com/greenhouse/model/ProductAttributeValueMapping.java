package com.greenhouse.model;

import java.io.Serializable;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "ProductAttributeValueMapping")
public class ProductAttributeValueMapping implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "ProductDetailId")
    private Product_Detail productDetail;

    @ManyToOne
    @JoinColumn(name = "AttributeValueId")
    private AttributeValue attributeValue;

    // Các phương thức getters và setters đã được tự động tạo bởi Lombok.
}
