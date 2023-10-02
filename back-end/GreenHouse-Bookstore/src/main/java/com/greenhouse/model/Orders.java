package com.greenhouse.model;

import java.io.Serializable;
import java.util.Date;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "Orders")
public class Orders implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Order_Id")
    private int orderId;

    @ManyToOne
    @JoinColumn(name = "Invoice_Id")
    private Invoices invoice;

    @ManyToOne
    @JoinColumn(name = "Username")
    private Accounts username;

    @Column(name = "Order_Date")
    private Date orderDate;

    @Column(name = "Delivery_Date")
    private Date deliveryDate;

    // Các phương thức getters và setters đã được tự động tạo bởi Lombok.
}
