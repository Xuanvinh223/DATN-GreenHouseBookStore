package com.greenhouse.restcontroller.AdminRestController;

import com.greenhouse.model.Authors;
import com.greenhouse.service.AuthorsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/authors")
public class RestAuthorController {

    @Autowired
    private AuthorsService authorsService;

    @GetMapping
    public ResponseEntity<List<Authors>> getAllAuthors() {
        List<Authors> authorsList = authorsService.findAll();
        return ResponseEntity.ok(authorsList);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Authors> getAuthorById(@PathVariable String id) {
        Authors author = authorsService.findById(id);
        if (author != null) {
            return ResponseEntity.ok(author);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<Authors> addAuthor(@RequestBody Authors author) {
        authorsService.add(author);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> updateAuthor(@PathVariable String id, @RequestBody Authors updatedAuthor) {
        Authors existingAuthor = authorsService.findById(id);
        if (existingAuthor != null) {
            updatedAuthor.setAuthorId(existingAuthor.getAuthorId());
            authorsService.update(updatedAuthor);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAuthor(@PathVariable String id) {
        Authors author = authorsService.findById(id);
        if (author != null) {
            authorsService.delete(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
