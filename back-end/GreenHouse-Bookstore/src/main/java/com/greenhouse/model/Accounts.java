package com.greenhouse.model;

import java.io.Serializable;
import java.util.Date;
import jakarta.persistence.*;
import lombok.Data;


@Entity
@Data
@Table(name = "Accounts")
public class Accounts  implements Serializable {

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

    @Column(name = "CreateAt")
    private Date createAt;

    @Column(name = "DeletedAt")
    private Date deletedAt;

    @Column(name = "DeletedBy")
    private String deletedBy;

    @Column(name = "Active")
    private Boolean active;

    @Column(name = "Notification_Id")
    private Integer notificationId;

    // Getters and setters
}
