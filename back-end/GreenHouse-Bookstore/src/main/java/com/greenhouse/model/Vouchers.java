package com.greenhouse.model;

import lombok.Data;
import jakarta.persistence.*;
import java.io.Serializable;
import java.util.Date;
import java.util.List;
@Entity
@Data
@Table(name = "Vouchers")
public class Vouchers implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "VoucherId")
    private int voucherId;

    @Column(name = "Code", length = 100, nullable = false)
    private String code;

    @Column(name = "Discount_Type", columnDefinition = "nvarchar(200)", nullable = false)
    private String discountType;

    @Column(name = "Minimum_Purchase_Amount")
    private Double minimumPurchaseAmount;

    @Column(name = "Maximum_Discount_Amount")
    private Double maximumDiscountAmount;

    @Column(name = "Product_Id", length = 30)
    private String productId;

    @Column(name = "Product_Category_Id")
    private Integer productCategoryId;

    @Column(name = "Start_Date", nullable = false)
    private Date startDate;

    @Column(name = "End_Date", nullable = false)
    private Date endDate;

    @Column(name = "Total_Quantity", nullable = false)
    private int totalQuantity;

    @Column(name = "Used_Quantity", nullable = false)
    private int usedQuantity;

    @Column(name = "Status", nullable = false)
    private boolean status;

    // Các phương thức getters và setters đã được tự động tạo bởi Lombok.
}
