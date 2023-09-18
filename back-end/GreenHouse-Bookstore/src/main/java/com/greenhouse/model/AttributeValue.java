package com.greenhouse.model;


import java.io.Serializable;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "AttributeValue")
public class AttributeValue implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private int id;

    @Column(name = "AttributeId")
    private int attributeId;

    @Column(name = "Value")
    private String value;

    @ManyToOne
    @JoinColumn(name = "AttributeId", referencedColumnName = "ID", insertable = false, updatable = false)
    private ProductAttributes productAttribute;

    // Getters and setters
}
