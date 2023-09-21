package com.greenhouse.restcontroller.AdminRestController;

import com.greenhouse.model.Suppliers;
import com.greenhouse.service.SuppliersService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/suppliers")
public class RestSuppliersController {

    @Autowired
    private SuppliersService suppliersService;

    @GetMapping
    public ResponseEntity<List<Suppliers>> getAllSuppliers() {
        List<Suppliers> suppliersList = suppliersService.findAll();
        return ResponseEntity.ok(suppliersList);
    }

 
}
