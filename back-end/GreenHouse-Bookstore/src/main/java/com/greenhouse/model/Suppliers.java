package com.greenhouse.model;

import lombok.Data;
import jakarta.persistence.*;
import java.io.Serializable;
import java.util.List;

@Data
@Entity
@Table(name = "Suppliers")
public class Suppliers implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SupplierId")
    private int supplierId;

    @Column(name = "SupplierName")
    private String supplierName;

    @Column(name = "Description", columnDefinition = "nvarchar(300)")
    private String description;

    @Column(name = "Address", columnDefinition = "nvarchar(200)")
    private String address;

    @Column(name = "Email")
    private String email;

    @Column(name = "Phone")
    private String phone;

    @Column(name = "Image", columnDefinition = "nvarchar(200)")
    private String image;

    @OneToMany(mappedBy = "supplier")
    private List<ImportInvoice> importInvoices;
}
