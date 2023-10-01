package com.greenhouse.restcontroller.AdminRestController;

import com.greenhouse.model.Product_Detail;
import com.greenhouse.service.ProductDetailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "/rest/productDetails")
public class RestProductDetailCtrl {

    @Autowired
    private ProductDetailService productDetailService;

    @GetMapping
    public ResponseEntity<List<Product_Detail>> getAllProductDetails() {
        List<Product_Detail> productDetails = productDetailService.findAll();
        return new ResponseEntity<>(productDetails, HttpStatus.OK);
    }

    @GetMapping(value = "/{id}")
    public ResponseEntity<Product_Detail> getOne(@PathVariable("id") Integer id) {
        Product_Detail productDetail = productDetailService.findById(id);
        if (productDetail == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(productDetail, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Product_Detail> create(@RequestBody Product_Detail productDetail) {
        Product_Detail createdProductDetail = productDetailService.add(productDetail);
        return new ResponseEntity<>(createdProductDetail, HttpStatus.OK);
    }

    @PutMapping(value = "/{id}")
    public ResponseEntity<Product_Detail> update(@PathVariable("id") Integer id, @RequestBody Product_Detail productDetail) {
        Product_Detail existingProductDetail = productDetailService.findById(id);
        if (existingProductDetail == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        productDetail.setProductDetailId(id); // Đảm bảo tính nhất quán về ID
        Product_Detail updatedProductDetail = productDetailService.update(productDetail);
        return new ResponseEntity<>(updatedProductDetail, HttpStatus.OK);
    }

    @DeleteMapping(value = "/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") Integer id) {
        Product_Detail existingProductDetail = productDetailService.findById(id);
        if (existingProductDetail == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        productDetailService.delete(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
