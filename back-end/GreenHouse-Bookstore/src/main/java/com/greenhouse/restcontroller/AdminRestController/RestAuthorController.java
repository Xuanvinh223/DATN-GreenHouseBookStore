package com.greenhouse.restcontroller.AdminRestController;

import com.greenhouse.model.Authors;
import com.greenhouse.service.AuthorsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "/rest/authors")
public class RestAuthorController {

    @Autowired
    private AuthorsService authorsService;

    @GetMapping
    public ResponseEntity<List<Authors>> getAllAuthors() {
        List<Authors> authors = authorsService.findAll();
        return new ResponseEntity<>(authors, HttpStatus.OK);
    }

    @GetMapping(value = "/{id}")
    public ResponseEntity<Authors> getOne(@PathVariable("id") String id) {
        Authors author = authorsService.findById(id);
        if (author == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(author, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Object> create(@RequestBody Authors author) {
        if (author.getAuthorId() == null || author.getAuthorId().isEmpty()) {
            return new ResponseEntity<>("Mã tác giả không hợp lệ.", HttpStatus.BAD_REQUEST);
        }

        Authors existingAuthor = authorsService.findById(author.getAuthorId());
        if (existingAuthor != null) {
            return new ResponseEntity<>("Tác giả đã tồn tại.", HttpStatus.BAD_REQUEST);
        }

        Authors createdAuthor = authorsService.add(author);
        return new ResponseEntity<>(createdAuthor, HttpStatus.OK);
    }

    @PutMapping(value = "/{id}")
    public ResponseEntity<Authors> update(@PathVariable("id") String id, @RequestBody Authors author) {
        Authors existingAuthor = authorsService.findById(id);
        if (existingAuthor == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        author.setAuthorId(id); // Đảm bảo tính nhất quán về ID
        authorsService.update(author);
        return new ResponseEntity<>(author, HttpStatus.OK);
    }

    @DeleteMapping(value = "/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") String id) {
        Authors existingAuthor = authorsService.findById(id);
        if (existingAuthor == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        authorsService.delete(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
