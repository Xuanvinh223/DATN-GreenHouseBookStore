package com.greenhouse.model;

import lombok.Data;
import jakarta.persistence.*;
import java.io.Serializable;
import java.util.Date;

@Data
@Entity
@Table(name = "StatusOrder")
public class StatusOrder implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "StatusOrderId")
    private int statusOrderId;

    @ManyToOne
    @JoinColumn(name = "OrderId")
    private Orders order;

    @ManyToOne
    @JoinColumn(name = "StatusId")
    private Status status;

    @Column(name = "UpdateAt")
    private Date updateAt;
}
