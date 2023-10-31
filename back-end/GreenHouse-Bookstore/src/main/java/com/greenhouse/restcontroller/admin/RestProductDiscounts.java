package com.greenhouse.restcontroller.admin;

import com.greenhouse.model.Product_Discount;
import com.greenhouse.service.ProductDiscountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "/rest/productDiscounts")
public class RestProductDiscounts {

    @Autowired
    private ProductDiscountService productDiscountService;

    @GetMapping
    public ResponseEntity<List<Product_Discount>> getAllProductDiscounts() {
        List<Product_Discount> productDiscounts = productDiscountService.findAll();
        return new ResponseEntity<>(productDiscounts, HttpStatus.OK);
    }

    @GetMapping(value = "/{id}")
    public ResponseEntity<Product_Discount> getOne(@PathVariable("id") Integer id) {
        Product_Discount productDiscount = productDiscountService.findById(id);
        if (productDiscount == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(productDiscount, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Product_Discount> create(@RequestBody Product_Discount productDiscount) {
        productDiscountService.add(productDiscount);
        return new ResponseEntity<>(productDiscount, HttpStatus.CREATED);
    }

    @PutMapping(value = "/{id}")
    public ResponseEntity<Product_Discount> update(@PathVariable("id") Integer id, @RequestBody Product_Discount productDiscount) {
        Product_Discount existingProductDiscount = productDiscountService.findById(id);
        if (existingProductDiscount == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        productDiscount.setId(id); // Đảm bảo tính nhất quán về ID
        productDiscountService.update(productDiscount);
        return new ResponseEntity<>(productDiscount, HttpStatus.OK);
    }

    @DeleteMapping(value = "/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") Integer id) {
        Product_Discount existingProductDiscount = productDiscountService.findById(id);
        if (existingProductDiscount == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        productDiscountService.delete(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
