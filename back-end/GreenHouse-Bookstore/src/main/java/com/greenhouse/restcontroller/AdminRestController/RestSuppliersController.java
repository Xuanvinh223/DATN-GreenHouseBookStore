package com.greenhouse.restcontroller.AdminRestController;

import com.greenhouse.model.Suppliers;
import com.greenhouse.service.SuppliersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "/rest/suppliers")
public class RestSuppliersController {

    @Autowired
    private SuppliersService suppliersService;

    @GetMapping
    public ResponseEntity<List<Suppliers>> getAllSuppliers() {
        List<Suppliers> suppliers = suppliersService.findAll();
        return new ResponseEntity<>(suppliers, HttpStatus.OK);
    }

    @GetMapping(value = "/{id}")
    public ResponseEntity<Suppliers> getOne(@PathVariable("id") String id) {
        Suppliers supplier = suppliersService.findById(id);
        if (supplier == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(supplier, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Object> create(@RequestBody Suppliers supplier) {
        if (supplier.getSupplierId() == null || supplier.getSupplierId().isEmpty()) {
            return new ResponseEntity<>("Mã nhà cung cấp không hợp lệ.", HttpStatus.BAD_REQUEST);
        }

        Suppliers existingSupplier = suppliersService.findById(supplier.getSupplierId());
        if (existingSupplier != null) {
            return new ResponseEntity<>("Nhà cung cấp đã tồn tại.", HttpStatus.BAD_REQUEST);
        }

        Suppliers createdSupplier = suppliersService.add(supplier);
        return new ResponseEntity<>(createdSupplier, HttpStatus.OK);
    }

    @PutMapping(value = "/{id}")
    public ResponseEntity<Suppliers> update(@PathVariable("id") String id, @RequestBody Suppliers supplier) {
        Suppliers existingSupplier = suppliersService.findById(id);
        if (existingSupplier == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        supplier.setSupplierId(id); // Đảm bảo tính nhất quán về ID
        suppliersService.update(supplier);
        return new ResponseEntity<>(supplier, HttpStatus.OK);
    }

    @DeleteMapping(value = "/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") String id) {
        Suppliers existingSupplier = suppliersService.findById(id);
        if (existingSupplier == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        suppliersService.delete(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
