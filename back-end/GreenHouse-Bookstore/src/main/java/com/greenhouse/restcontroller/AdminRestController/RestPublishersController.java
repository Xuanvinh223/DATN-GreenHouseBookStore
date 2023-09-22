package com.greenhouse.restcontroller.AdminRestController;

import com.greenhouse.model.Publishers;
import com.greenhouse.service.PublishersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "/rest/publishers")
public class RestPublishersController {

    @Autowired
    private PublishersService publishersService;

    @GetMapping
    public ResponseEntity<List<Publishers>> getAllPublishers() {
        List<Publishers> publishers = publishersService.findAll();
        return new ResponseEntity<>(publishers, HttpStatus.OK);
    }

    @GetMapping(value = "/{id}")
    public ResponseEntity<Publishers> getOne(@PathVariable("id") String id) {
        Publishers publisher = publishersService.findById(id);
        if (publisher == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(publisher, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Object> create(@RequestBody Publishers publisher) {
        if (publisher.getPublisherId() == null || publisher.getPublisherId().isEmpty()) {
            return new ResponseEntity<>("Mã nhà xuất bản không hợp lệ.", HttpStatus.BAD_REQUEST);
        }

        Publishers existingPublisher = publishersService.findById(publisher.getPublisherId());
        if (existingPublisher != null) {
            return new ResponseEntity<>("Nhà xuất bản đã tồn tại.", HttpStatus.BAD_REQUEST);
        }

        Publishers createdPublisher = publishersService.add(publisher);
        return new ResponseEntity<>(createdPublisher, HttpStatus.OK);
    }

    @PutMapping(value = "/{id}")
    public ResponseEntity<Publishers> update(@PathVariable("id") String id, @RequestBody Publishers publisher) {
        Publishers existingPublisher = publishersService.findById(id);
        if (existingPublisher == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        publisher.setPublisherId(id); // Đảm bảo tính nhất quán về ID
        publishersService.update(publisher);
        return new ResponseEntity<>(publisher, HttpStatus.OK);
    }

    @DeleteMapping(value = "/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") String id) {
        Publishers existingPublisher = publishersService.findById(id);
        if (existingPublisher == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        publishersService.delete(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
