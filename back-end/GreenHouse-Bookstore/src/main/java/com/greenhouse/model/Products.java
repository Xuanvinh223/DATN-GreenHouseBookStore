package com.greenhouse.model;

import java.io.Serializable;
import java.util.Date;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "Products")
public class Products implements Serializable {

    @Id
    @Column(name = "Product_Id", length = 30)
    private String productId;

    @Column(name = "Product_Name", columnDefinition = "nvarchar(100)", nullable = false)
    private String productName;

    @Column(name = "Description", columnDefinition = "nvarchar(200)")
    private String description;

    @Column(name = "Manufacture_Date", nullable = false)
    private Date manufactureDate;

    @Column(name = "status", nullable = false)
    private boolean status;

    @Column(name = "Create_At")
    private Date createAt;

    @Column(name = "Delete_At")
    private Date deleteAt;

    @Column(name = "Delete_By", length = 200)
    private String deleteBy;

    @Column(name = "Update_At")
    private Date updateAt;

    @Column(name = "Brand_Id", length = 30, nullable = false)
    private String brandId;

    @Column(name = "publisher_id", length = 30, nullable = false)
    private String publisherId;

    @ManyToOne
    @JoinColumn(name = "Brand_Id", insertable = false, updatable = false)
    private Brands brand;

    @ManyToOne
    @JoinColumn(name = "publisher_id", insertable = false, updatable = false)
    private Publishers publisher;

    // Các phương thức getters và setters đã được tự động tạo bởi Lombok.
}
