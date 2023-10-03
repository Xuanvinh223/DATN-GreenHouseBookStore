package com.greenhouse.restcontroller.AdminRestController;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.greenhouse.service.FlashSalesService;
import com.greenhouse.service.ProductDetailService;

@RestController
@CrossOrigin("*")
public class RestInventoryStatic {

    @Autowired
    ProductDetailService pd;

    @GetMapping("/rest/inventory-static")
	public ResponseEntity<List<Object[]>> getAll(Model m) {
		return ResponseEntity.ok(pd.findAllInventoryList());
	}
}