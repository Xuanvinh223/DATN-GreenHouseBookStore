package com.greenhouse.restcontroller.admin;

import com.greenhouse.model.ProductAttributeValueMapping;
import com.greenhouse.service.ProductAttributeValueMappingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "/rest/proAttriValMapp")
public class RestProAttriValMappCtrl {

    @Autowired
    private ProductAttributeValueMappingService productAttributeValueMappingService;

    @GetMapping
    public ResponseEntity<List<ProductAttributeValueMapping>> getAllProductAttributeValueMappings() {
        List<ProductAttributeValueMapping> mappings = productAttributeValueMappingService.findAll();
        return new ResponseEntity<>(mappings, HttpStatus.OK);
    }

    @GetMapping(value = "/{id}")
    public ResponseEntity<ProductAttributeValueMapping> getOne(@PathVariable("id") Integer id) {
        ProductAttributeValueMapping mapping = productAttributeValueMappingService.findById(id);
        if (mapping == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(mapping, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Object> create(@RequestBody ProductAttributeValueMapping mapping) {


        ProductAttributeValueMapping createdMapping = productAttributeValueMappingService.add(mapping);
        return new ResponseEntity<>(createdMapping, HttpStatus.OK);
    }

    @PutMapping(value = "/{id}")
    public ResponseEntity<ProductAttributeValueMapping> update(@PathVariable("id") Integer id, @RequestBody ProductAttributeValueMapping mapping) {
        ProductAttributeValueMapping existingMapping = productAttributeValueMappingService.findById(id);
        if (existingMapping == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        mapping.setId(id); // Đảm bảo tính nhất quán về ID
        productAttributeValueMappingService.update(mapping);
        return new ResponseEntity<>(mapping, HttpStatus.OK);
    }

    @DeleteMapping(value = "/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") Integer id) {
        ProductAttributeValueMapping existingMapping = productAttributeValueMappingService.findById(id);
        if (existingMapping == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        productAttributeValueMappingService.delete(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
