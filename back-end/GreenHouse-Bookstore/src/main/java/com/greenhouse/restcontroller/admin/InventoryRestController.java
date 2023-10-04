package com.greenhouse.restcontroller.admin;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.greenhouse.dto.Response;
import com.greenhouse.model.*;
import com.greenhouse.repository.*;

@RestController
@CrossOrigin("*")
public class InventoryRestController {

    @Autowired
    ProductDetailRepository productDetailRepository;

    @Autowired
    SuppliersRepository suppliersRepository;

    @Autowired
    ImportInvoiceRepository impInvoice_Repository;

    @Autowired
    ImportInvoice_DetailRepository impInvoiceDetailRepository;

    @GetMapping("/rest/getInventory")
    public ResponseEntity<Map<String, Object>> getInventory() {
        Map<String, Object> resp = new HashMap<>();
        List<Import_Invoice> importInvoice = impInvoice_Repository.findAll();
        List<Import_Invoice_Detail> importInvoiceDetails = impInvoiceDetailRepository.findAll();
        List<Product_Detail> productDetails = productDetailRepository.findAll();
        List<Suppliers> suppliers = suppliersRepository.findAll();

        resp.put("importInvoice", importInvoice);
        resp.put("importInvoiceDetails", importInvoiceDetails);
        resp.put("listProductDetails", productDetails);
        resp.put("suppliers", suppliers);
        return ResponseEntity.ok(resp);
    }
}
