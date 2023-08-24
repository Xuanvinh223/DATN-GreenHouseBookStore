package com.greenhouse.model;

import java.io.Serializable;
import jakarta.persistence.*;
import lombok.Data;
@Data
@Entity
@Table(name = "CategoryTypes")
public class CategoryTypes implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "TypeId")
    private int typeId;

    @Column(name = "TypeName")
    private String typeName;

    @Column(name = "Description")
    private String description;
}
