package com.greenhouse.model;

import java.io.Serializable;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "Authors")
@Data
public class Authors implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "AuthorId")
    private int authorId;

    @Column(name = "AuthorName")
    private String authorName;

    @Column(name = "Gender")
    private boolean gender;

    @Column(name = "Nation")
    private String nation;

    // Constructors, getters, setters...
}
