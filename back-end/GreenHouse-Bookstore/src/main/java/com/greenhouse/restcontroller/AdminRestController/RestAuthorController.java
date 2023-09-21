package com.greenhouse.restcontroller.AdminRestController;

import com.greenhouse.model.Authors;
import com.greenhouse.service.AuthorsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "/rest/authors")
public class RestAuthorController {

    @Autowired
    private AuthorsService authorsService;

    @GetMapping
    private ResponseEntity<List<Authors>> getAllAuthors() {
        return ResponseEntity.ok(authorsService.findAll());
    }

    @GetMapping(value = "/{id}")
    private ResponseEntity<Authors> getOne(@PathVariable("id") String id) {
        Authors author = authorsService.findById(id);
        if (author == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(author);
    }

    @PostMapping
    private ResponseEntity<?> create(@RequestBody Authors author) {
        // Kiểm tra nếu authorId là null hoặc rỗng thì trả về lỗi
        if (author.getAuthorId() == null || author.getAuthorId().isEmpty()) {
            return ResponseEntity.badRequest().body("Mã tác giả không hợp lệ.");
        }
    
        Authors existingAuthor = authorsService.findById(author.getAuthorId());
        if (existingAuthor != null) {
            return ResponseEntity.badRequest().body("Tác giả đã tồn tại.");
        }
        
        Authors createdAuthor = authorsService.add(author);
        return ResponseEntity.ok(createdAuthor);
    }
    
    
    @PutMapping(value = "/{id}")
    private ResponseEntity<Authors> update(@PathVariable("id") String id, @RequestBody Authors author) {
        Authors existingAuthor = authorsService.findById(id);
        if (existingAuthor == null) {
            return ResponseEntity.notFound().build();
        }
        author.setAuthorId(id); // Ensure ID consistency
        authorsService.update(author);
        return ResponseEntity.ok(author);
    }

    @DeleteMapping(value = "/{id}")
    private ResponseEntity<Void> delete(@PathVariable("id") String id) {
        Authors existingAuthor = authorsService.findById(id);
        if (existingAuthor == null) {
            return ResponseEntity.notFound().build();
        }
        authorsService.delete(id);
        return ResponseEntity.ok().build();
    }
}
