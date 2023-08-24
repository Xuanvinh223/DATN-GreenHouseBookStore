package com.greenhouse.model;

import lombok.Data;
import jakarta.persistence.*;
import java.io.Serializable;

@Data
@Entity
@Table(name = "Sizes")
public class Sizes implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SizeId")
    private int sizeId;

    @Column(name = "Size", columnDefinition = "nvarchar(100)")
    private String size;
}
