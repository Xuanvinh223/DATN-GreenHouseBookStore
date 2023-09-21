package com.greenhouse.restcontroller.AdminRestController;

import com.greenhouse.model.Publishers;
import com.greenhouse.service.PublishersService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/publishers")
public class RestPublishersController {

    @Autowired
    private PublishersService publishersService;

    @GetMapping
    public ResponseEntity<List<Publishers>> getAllPublishers() {
        List<Publishers> publishersList = publishersService.findAll();
        return ResponseEntity.ok(publishersList);
    }

 
}
