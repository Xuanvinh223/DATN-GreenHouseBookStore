package com.greenhouse.restcontroller.admin;

import com.greenhouse.model.Book_Authors;
import com.greenhouse.service.BookAuthorsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "/rest/bookAuthors")
public class RestBookAuthorCtrl {

    @Autowired
    private BookAuthorsService bookAuthorsService;

    @GetMapping
    public ResponseEntity<List<Book_Authors>> getAllBookAuthors() {
        List<Book_Authors> bookAuthors = bookAuthorsService.findAll();
        return new ResponseEntity<>(bookAuthors, HttpStatus.OK);
    }

    @GetMapping(value = "/{id}")
    public ResponseEntity<Book_Authors> getOne(@PathVariable("id") Integer id) {
        Book_Authors bookAuthor = bookAuthorsService.findById(id);
        if (bookAuthor == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(bookAuthor, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Book_Authors> create(@RequestBody Book_Authors bookAuthor) {
        Book_Authors createdBookAuthor = bookAuthorsService.add(bookAuthor);
        return new ResponseEntity<>(createdBookAuthor, HttpStatus.CREATED);
    }

    @PutMapping(value = "/{id}")
    public ResponseEntity<Book_Authors> update(@PathVariable("id") Integer id, @RequestBody Book_Authors bookAuthor) {
        Book_Authors existingBookAuthor = bookAuthorsService.findById(id);
        if (existingBookAuthor == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        bookAuthor.setId(id); // Đảm bảo tính nhất quán về ID
        bookAuthorsService.update(bookAuthor);
        return new ResponseEntity<>(bookAuthor, HttpStatus.OK);
    }

    @DeleteMapping(value = "/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") Integer id) {
        Book_Authors existingBookAuthor = bookAuthorsService.findById(id);
        if (existingBookAuthor == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        bookAuthorsService.delete(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
