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

    @Column(name = "DiscountType", columnDefinition = "nvarchar(200)", nullable = false)
    private String discountType;

    @Column(name = "MinimumPurchaseAmount")
    private Double minimumPurchaseAmount;

    @Column(name = "MaximumDiscountAmount")
    private Double maximumDiscountAmount;

    @Column(name = "ProductId", length = 30)
    private String productId;

    @Column(name = "ProductCategoryId")
    private Integer productCategoryId;

    @Column(name = "ApplicableOrderAmount")
    private Double applicableOrderAmount;

    @Column(name = "StartDate", nullable = false)
    private Date startDate;

    @Column(name = "EndDate", nullable = false)
    private Date endDate;

    @Column(name = "TotalQuantity", nullable = false)
    private int totalQuantity;

    @Column(name = "UsedQuantity", nullable = false)
    private int usedQuantity;

    @Column(name = "Status", nullable = false)
    private boolean status;

    @OneToMany(mappedBy = "voucher")
    private List<UserVoucher> userVouchers;

    // Các phương thức getters và setters đã được tự động tạo bởi Lombok.
}
