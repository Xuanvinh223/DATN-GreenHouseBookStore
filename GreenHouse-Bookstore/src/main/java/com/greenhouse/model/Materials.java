package com.greenhouse.model;

import lombok.Data;
import jakarta.persistence.*;
import java.io.Serializable;

@Data
@Entity
@Table(name = "Materials")
public class Materials implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "MaterialId")
    private int materialId;

    @Column(name = "Material")
    private String material;
}
