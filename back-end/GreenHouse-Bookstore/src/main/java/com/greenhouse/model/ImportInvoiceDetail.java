package com.greenhouse.model;

import lombok.Data;
import jakarta.persistence.*;
import java.io.Serializable;
import java.math.BigDecimal;

@Data
@Entity
@Table(name = "ImportInvoice_Detail")
public class ImportInvoiceDetail implements Serializable {
   
    @ManyToOne
    @EmbeddedId
    @MapsId("importInvoiceId")
    @JoinColumn(name = "ImportInvoiceId")
    private ImportInvoice importInvoice;

    @ManyToOne
    @EmbeddedId
    @JoinColumn(name = "InventoryId")
    private Inventory inventory;

    @Column(name = "Quantity")
    private int quantity;

    @Column(name = "Price")
    private BigDecimal price;

    @ManyToOne
    @JoinColumn(name = "ProductDetailId")
    private ProductDetail productDetail;
}
