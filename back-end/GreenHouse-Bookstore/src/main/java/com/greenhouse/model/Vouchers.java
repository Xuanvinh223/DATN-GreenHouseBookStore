package com.greenhouse.model;

import lombok.Data;
import jakarta.persistence.*;
import java.io.Serializable;
import java.util.Date;
import java.util.List;

@Data
@Entity
@Table(name = "Vouchers")
public class Vouchers implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "VoucherId")
    private int voucherId;

    @Column(name = "Code", columnDefinition = "varchar(100)")
    private String code;

    @Column(name = "Value")
    private int value;

    @Column(name = "StartDate")
    private Date startDate;

    @Column(name = "EndDate")
    private Date endDate;

    @Column(name = "Quantity")
    private int quantity;

    @Column(name = "UsedQuantity")
    private int usedQuantity;

    @Column(name = "Active")
    private boolean active;

    @OneToMany(mappedBy = "voucher")
    private List<UserVoucher> userVouchers;
}
