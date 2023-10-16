package com.greenhouse.restcontroller.client;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.greenhouse.repository.ProductsRepository;

@RestController
public class IndexController {

    @Autowired
    ProductsRepository productsReps;

    @GetMapping("/rest/getDataIndex")
    public ResponseEntity<Map<String, Object>> getDataIndex() {
        Map<String, Object> resp = new HashMap<>();

       
        List<Object[]> sellingProducts = productsReps.SellingProduct();

        // Xử lý dữ liệu và thêm vào resp
        resp.put("sellingProducts", sellingProducts);

        return ResponseEntity.ok(resp);
    }
}
