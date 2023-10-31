package com.greenhouse.dto;

import com.greenhouse.model.Authors;
import com.greenhouse.model.Book_Authors;
import com.greenhouse.model.Categories;
import com.greenhouse.model.Discounts;
import com.greenhouse.model.Product_Category;
import com.greenhouse.model.Product_Detail;
import com.greenhouse.model.Product_Discount;
import com.greenhouse.model.Product_Images;
import com.greenhouse.model.Products;

import lombok.Data;

@Data
public class ProductDTO {

    private Products product;
    private Categories category;
    private Authors author;
    private Discounts discount;
    private Product_Detail productDetail; // Thêm đối tượng ProductDetail
    private Product_Category pCategory;
    private Product_Discount pDiscount;
    private Book_Authors bAuthors;
    private Product_Images productImages;

    private String images;

    // Thêm các thuộc tính của ProductDetail

    private double price;
    private double priceDiscount;
    private int quantityInStock;
    private int weight;
    private String image;
}
