package com.greenhouse.dto.client;

import java.util.List;

import com.greenhouse.model.Product_Detail;

import lombok.Data;

@Data
public class CartDTO {
    private String username;
    private int quantity;
    private int productDetailId;
}
