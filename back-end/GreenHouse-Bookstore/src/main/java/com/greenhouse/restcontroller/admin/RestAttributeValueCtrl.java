package com.greenhouse.restcontroller.admin;

import com.greenhouse.model.AttributeValue;
import com.greenhouse.service.AttributeValueService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "/rest/attributeValues")
public class RestAttributeValueCtrl {

    @Autowired
    private AttributeValueService attributeValueService;

    @GetMapping
    public ResponseEntity<List<AttributeValue>> getAllAttributeValues() {
        List<AttributeValue> attributeValues = attributeValueService.findAll();
        return new ResponseEntity<>(attributeValues, HttpStatus.OK);
    }

    @GetMapping(value = "/{id}")
    public ResponseEntity<AttributeValue> getOne(@PathVariable("id") Integer id) {
        AttributeValue attributeValue = attributeValueService.findById(id);
        if (attributeValue == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(attributeValue, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Object> create(@RequestBody AttributeValue attributeValue) {

        AttributeValue createdAttributeValue = attributeValueService.add(attributeValue);
        return new ResponseEntity<>(createdAttributeValue, HttpStatus.OK);
    }

    @PutMapping(value = "/{id}")
    public ResponseEntity<AttributeValue> update(@PathVariable("id") Integer id, @RequestBody AttributeValue attributeValue) {
        AttributeValue existingAttributeValue = attributeValueService.findById(id);
        if (existingAttributeValue == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        attributeValue.setId(id); // Đảm bảo tính nhất quán về ID
        attributeValueService.update(attributeValue);
        return new ResponseEntity<>(attributeValue, HttpStatus.OK);
    }

    @DeleteMapping(value = "/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") Integer id) {
        AttributeValue existingAttributeValue = attributeValueService.findById(id);
        if (existingAttributeValue == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        attributeValueService.delete(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
