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
    private int id;

    @ManyToOne
    @JoinColumn(name = "Product_Detail_Id")
    private Product_Detail productDetail;

    @ManyToOne
    @JoinColumn(name = "Attribute_Value_Id")
    private AttributeValue attributeValue;

    // Các phương thức getters và setters đã được tự động tạo bởi Lombok.
}
