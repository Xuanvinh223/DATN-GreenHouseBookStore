package com.greenhouse.restcontroller.admin;

import com.greenhouse.model.ProductAttributes;
import com.greenhouse.service.ProductAttributesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "/rest/productAttributes")
public class RestProductAttributesCtrl {

    @Autowired
    private ProductAttributesService productAttributesService;

    @GetMapping
    public ResponseEntity<List<ProductAttributes>> getAllProductAttributes() {
        List<ProductAttributes> productAttributes = productAttributesService.findAll();
        return new ResponseEntity<>(productAttributes, HttpStatus.OK);
    }

    @GetMapping(value = "/{id}")
    public ResponseEntity<ProductAttributes> getOne(@PathVariable("id") Integer id) {
        ProductAttributes productAttribute = productAttributesService.findById(id);
        if (productAttribute == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(productAttribute, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Object> create(@RequestBody ProductAttributes productAttribute) {
        ProductAttributes createdProductAttribute = productAttributesService.add(productAttribute);
        return new ResponseEntity<>(createdProductAttribute, HttpStatus.OK);
    }

    @PutMapping(value = "/{id}")
    public ResponseEntity<ProductAttributes> update(@PathVariable("id") Integer id, @RequestBody ProductAttributes productAttribute) {
        ProductAttributes existingProductAttribute = productAttributesService.findById(id);
        if (existingProductAttribute == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        productAttribute.setAtributeId(id); // Đảm bảo tính nhất quán về ID
        productAttributesService.update(productAttribute);
        return new ResponseEntity<>(productAttribute, HttpStatus.OK);
    }

    @DeleteMapping(value = "/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") Integer id) {
        ProductAttributes existingProductAttribute = productAttributesService.findById(id);
        if (existingProductAttribute == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        productAttributesService.delete(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
