package com.greenhouse.model;


import java.io.Serializable;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "Age")
@Data
public class Age implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "AgeId")
    private int ageId;

    @Column(name = "Age")
    private int age;

    // Getters and setters

    // Other methods
}
