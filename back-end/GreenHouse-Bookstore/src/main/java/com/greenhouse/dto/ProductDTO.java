package com.greenhouse.dto;

import com.greenhouse.model.Authors;
import com.greenhouse.model.Categories;
import com.greenhouse.model.Discounts;
import com.greenhouse.model.Product_Detail;
import com.greenhouse.model.Products;

import lombok.Data;

@Data
public class ProductDTO {

    private Products product;
    private Categories category;
    private Authors author;
    private Discounts discount;
    private Product_Detail productDetail; // Thêm đối tượng ProductDetail

    // Thêm các thuộc tính của ProductDetail
    private double price;
    private double priceDiscount;
    private int quantityInStock;
    private String image;
    private int productImageId;
}
