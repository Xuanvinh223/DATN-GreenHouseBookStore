package com.greenhouse.model;

import lombok.Data;
import jakarta.persistence.*;
import java.io.Serializable;

@Data
@Entity
@Table(name = "UserVoucher")
public class UserVoucher implements Serializable {
    @Id
    @Column(name = "Username")
    private String username;

    @Id
    @Column(name = "VoucherId")
    private int voucherId;

    @ManyToOne
    @JoinColumn(name = "VoucherId")
    private Vouchers voucher;
}
