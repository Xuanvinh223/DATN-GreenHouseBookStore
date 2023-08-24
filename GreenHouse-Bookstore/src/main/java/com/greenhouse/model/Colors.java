package com.greenhouse.model;

import java.io.Serializable;
import jakarta.persistence.*;
import lombok.Data;
@Data
@Entity
@Table(name = "Colors")
public class Colors implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ColorId")
    private int colorId;

    @Column(name = "ColorName")
    private String colorName;

    @Column(name = "Hex")
    private String hex;
}
