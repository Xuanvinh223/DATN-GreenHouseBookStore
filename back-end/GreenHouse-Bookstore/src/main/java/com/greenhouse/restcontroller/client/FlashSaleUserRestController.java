package com.greenhouse.restcontroller.client;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.greenhouse.repository.FlashSalesRepository;
import com.greenhouse.repository.ProductDetailRepository;
import com.greenhouse.repository.Product_FlashSaleRepository;
import com.greenhouse.repository.Product_ImagesRepository;

@CrossOrigin("*")
@RestController
@RequestMapping("/customer")
public class FlashSaleUserRestController {
    @Autowired
    Product_FlashSaleRepository prod_FlashSaleRep;
    @Autowired
    FlashSalesRepository fSalesRep;
    @Autowired
    ProductDetailRepository prod_DetailRep;
    @Autowired
    Product_ImagesRepository prod_ImagesRep;

    //hiện những tk đang có flashsale , hiện thêm 5 thằng kế nó trong ngày
    @GetMapping()
    public ResponseEntity<Map<String, Object>> getDataFlashSale() {
        Map<String, Object> resp = new HashMap<>();

        return ResponseEntity.ok(resp);
    }
}
