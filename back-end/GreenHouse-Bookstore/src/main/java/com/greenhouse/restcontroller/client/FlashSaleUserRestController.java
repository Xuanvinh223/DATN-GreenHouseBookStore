package com.greenhouse.restcontroller.client;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.greenhouse.model.Flash_Sales;
import com.greenhouse.model.Product_Detail;
import com.greenhouse.model.Product_Flash_Sale;
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

    @GetMapping("/rest/flashsale")
    public ResponseEntity<Map<String, Object>> getDataFlashSale() {
        Map<String, Object> resp = new HashMap<>();
        List<Product_Flash_Sale> listProduct_FlashSale = prod_FlashSaleRep.findAll();
        List<Product_Detail> listProduct_Details = prod_DetailRep.findAll();
        List<Flash_Sales> listFlash_Sales = fSalesRep.findAll();

        resp.put("listProduct_FlashSale", listProduct_FlashSale);
        resp.put("listProduct_Details", listProduct_Details);
        resp.put("listFlash_Sales", listFlash_Sales);

        return ResponseEntity.ok(resp);
    }
}
