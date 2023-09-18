package com.greenhouse.model;



import java.io.Serializable;

import jakarta.persistence.*;
@Entity
@Table(name = "Address")
public class Address implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id")
    private Integer id;

    @Column(name = "Address")
    private String address;

    @Column(name = "Username")
    private String username;

    @ManyToOne
    @JoinColumn(name = "Username", referencedColumnName = "Username", insertable = false, updatable = false)
    private Accounts account;

    // Getters and setters
}
