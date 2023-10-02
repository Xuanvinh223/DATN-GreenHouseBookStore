package com.greenhouse.restcontroller.admin;

import com.greenhouse.model.Product_Category;
import com.greenhouse.service.ProductCategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "/rest/productCategories")
public class ProductCategoryCtrl {

    @Autowired
    private ProductCategoryService productCategoryService;

    @GetMapping
    public ResponseEntity<List<Product_Category>> getAllProductCategories() {
        List<Product_Category> productCategories = productCategoryService.findAll();
        return new ResponseEntity<>(productCategories, HttpStatus.OK);
    }

    @GetMapping(value = "/{id}")
    public ResponseEntity<Product_Category> getOne(@PathVariable("id") Integer id) {
        Product_Category productCategory = productCategoryService.findById(id);
        if (productCategory == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(productCategory, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Object> create(@RequestBody Product_Category productCategory) {
        Product_Category createdProductCategory = productCategoryService.add(productCategory);
        return new ResponseEntity<>(createdProductCategory, HttpStatus.OK);
    }


    @PutMapping(value = "/{id}")
    public ResponseEntity<Product_Category> update(@PathVariable("id") Integer id, @RequestBody Product_Category productCategory) {
        Product_Category existingProductCategory = productCategoryService.findById(id);
        if (existingProductCategory == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        productCategory.setId(id); // Đảm bảo tính nhất quán về ID
        productCategoryService.update(productCategory);
        return new ResponseEntity<>(productCategory, HttpStatus.OK);
    }

    @DeleteMapping(value = "/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") Integer id) {
        Product_Category existingProductCategory = productCategoryService.findById(id);
        if (existingProductCategory == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        productCategoryService.delete(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
