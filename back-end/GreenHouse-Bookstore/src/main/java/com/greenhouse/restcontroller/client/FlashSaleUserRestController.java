package com.greenhouse.restcontroller.client;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.greenhouse.model.Flash_Sales;
import com.greenhouse.model.Product_Detail;
import com.greenhouse.model.Product_Flash_Sale;
import com.greenhouse.service.FlashSalesService;
import com.greenhouse.service.ProductDetailService;
import com.greenhouse.service.ProductFlashSaleService;

@CrossOrigin("*")
@RestController
@RequestMapping("/customer/rest")
public class FlashSaleUserRestController {

    @Autowired
    private ProductFlashSaleService productFlashSaleService;
    @Autowired
    private FlashSalesService flashSalesService;

    @GetMapping("/productFlashSales")
    public ResponseEntity<List<Product_Flash_Sale>> getAllProductFlashSales() {
        List<Product_Flash_Sale> productFlashSales = productFlashSaleService.findAll();
        return ResponseEntity.ok(productFlashSales);

    }

    @GetMapping("/flashSales")
    public ResponseEntity<List<Flash_Sales>> getAllFlashSales() {
        List<Flash_Sales> flashSales = flashSalesService.findAll();
        return ResponseEntity.ok(flashSales);

    }

}
