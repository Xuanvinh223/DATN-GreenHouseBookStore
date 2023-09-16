package com.greenhouse.model;

import java.io.Serializable;
import java.util.Date;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "Accounts")
@Data
public class Accounts implements Serializable {

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
    private boolean gender;

    @Column(name = "Birthday")
    private Date birthday;

    @Column(name = "Phone")
    private String phone;

    @Column(name = "Image")
    private String image;

    @Column(name = "createat")
    private Date createAt;

    @Column(name = "deletedat")
    private Date deletedAt;

    @Column(name = "deletedby")
    private String deletedBy;

    @Column(name = "Active")
    private boolean active;
}
