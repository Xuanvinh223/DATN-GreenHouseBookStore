package com.greenhouse.model;

import lombok.Data;
import jakarta.persistence.*;
import java.io.Serializable;

@Entity
@Data
@Table(name = "UserVoucher")
public class UserVoucher implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id")
    private Integer id;

    @Column(name = "Username", length = 50)
    private String username;

    @ManyToOne
    @JoinColumn(name = "VoucherId")
    private Vouchers voucher;

    // Các phương thức getters và setters đã được tự động tạo bởi Lombok.
}
