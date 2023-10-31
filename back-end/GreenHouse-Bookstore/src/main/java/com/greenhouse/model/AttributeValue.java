package com.greenhouse.model;


import java.io.Serializable;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "Attribute_Value")
public class AttributeValue implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private int id;

    @ManyToOne
    @JoinColumn(name = "Attribute_Id")
    private ProductAttributes attributeId;

    @Column(name = "Value")
    private String value;


    // Getters and setters
}
