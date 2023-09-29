package com.greenhouse.model;

import java.io.Serializable;
import java.util.Date;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "Notification")
public class Notification implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Notification_Id")
    private int notificationId;

    @ManyToOne
    @JoinColumn(name = "Username")
    private Accounts username;

    @Column(name = "Message", columnDefinition = "nvarchar(50)")
    private String message;

    @Column(name = "Create_At")
    private Date createAt;

    // Các phương thức getters và setters đã được tự động tạo bởi Lombok.
}
