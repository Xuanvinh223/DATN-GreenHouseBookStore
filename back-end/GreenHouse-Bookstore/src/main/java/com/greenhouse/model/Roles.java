package com.greenhouse.model;

import lombok.Data;
import jakarta.persistence.*;
import java.io.Serializable;

@Data
@Entity
@Table(name = "Roles")
public class Roles implements Serializable {
    @Id
    @Column(name = "RoleId")
    private int roleId;

    @Column(name = "Role", columnDefinition = "nvarchar(50)")
    private String role;
}
