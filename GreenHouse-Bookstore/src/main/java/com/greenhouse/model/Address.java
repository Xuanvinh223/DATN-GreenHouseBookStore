package com.greenhouse.model;


import java.io.Serializable;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "Address")
@Data
public class Address implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id")
    private int id;

    @Column(name = "Address")
    private String address;

    @ManyToOne
    @JoinColumn(name = "Username")
    private Accounts accounts;

    // Getters and setters

    // Other methods
}
