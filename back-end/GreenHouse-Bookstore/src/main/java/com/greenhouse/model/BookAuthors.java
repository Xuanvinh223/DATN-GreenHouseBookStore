package com.greenhouse.model;

import java.io.Serializable;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "Book_Authors")
@Data
public class BookAuthors implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id")
    private int id;

    @ManyToOne
    @JoinColumn(name = "AuthorId")
    private Authors author;

    @ManyToOne
    @JoinColumn(name = "ProductId")
    private Products product;
}
