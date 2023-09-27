package com.greenhouse.restcontroller.AdminRestController;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.greenhouse.model.Accounts;
import com.greenhouse.model.Flash_Sales;
import com.greenhouse.service.FlashSalesService;

@RestController
@CrossOrigin("*")
public class FlashSaleRestController {

    @Autowired
    FlashSalesService fs;

    @GetMapping("/rest/flashsales")
	public ResponseEntity<List<Object[]>> getAll(Model m) {
		return ResponseEntity.ok(fs.findAllFlashSale());
	}
}
