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

    @Column(name = "RoleId")
    private int roleId;

    @ManyToOne
    @JoinColumn(name = "Username", referencedColumnName = "Username", insertable = false, updatable = false)
    private Accounts account;

    @ManyToOne
    @JoinColumn(name = "RoleId", referencedColumnName = "RoleId", insertable = false, updatable = false)
    private Roles role;

    // Getters and setters
}
