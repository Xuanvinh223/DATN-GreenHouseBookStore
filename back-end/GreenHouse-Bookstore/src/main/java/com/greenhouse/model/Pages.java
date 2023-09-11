package com.greenhouse.model;

import lombok.Data;
import jakarta.persistence.*;
import java.io.Serializable;

@Data
@Entity
@Table(name = "Pages")
public class Pages implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "PageId")
    private int pageId;

    @Column(name = "NumberOfPages")
    private int numberOfPages;
}
