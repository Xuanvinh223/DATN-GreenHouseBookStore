package com.greenhouse.model;

import java.io.Serializable;
import java.util.Date;
import jakarta.persistence.*;
import lombok.Data;


@Entity
@Data
@Table(name = "Accounts")
public class Accounts implements Serializable {

    /**
     *
     */
    private static final long serialVersionUID = 1L;

    @Id
    @Column(name = "Username")
    private String username;

    @Column(name = "Password")
    private String password;

    @Column(name = "Fullname")
    private String fullname;

    @Column(name = "Email")
    private String email;

    @Column(name = "Gender")
    private Boolean gender;

    @Column(name = "Birthday")
    private Date birthday;

    @Column(name = "Phone")
    private String phone;

    @Column(name = "Image")
    private String image;

    @Column(name = "create_at")
    private Date createAt;

    @Column(name = "deleted_at")
    private Date deletedAt;

    @Column(name = "deleted_by")
    private String deletedBy;

    @Column(name = "Active")
    private Boolean active;


   
   
    // Getters and setters
}
