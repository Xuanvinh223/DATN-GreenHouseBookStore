package com.greenhouse.model;

import lombok.Data;
import jakarta.persistence.*;
import java.io.Serializable;

@Data
@Entity
@Table(name = "CoverTypes")
public class CoverTypes implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CoverTypeId")
    private int coverTypeId;

    @Column(name = "CoverTypeName", columnDefinition = "nvarchar(50)", nullable = false)
    private String coverTypeName;
}
