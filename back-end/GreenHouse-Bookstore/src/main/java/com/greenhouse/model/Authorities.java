package com.greenhouse.model;
import java.io.Serializable;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "Authorities")
@Data
public class Authorities implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "AuthoritiesId")
    private int authoritiesId;

    @Column(name = "Username")
    private String username;

    @ManyToOne
    @JoinColumn(name = "RoleId")
    private Roles role;

    // Constructors, getters, setters...
}
