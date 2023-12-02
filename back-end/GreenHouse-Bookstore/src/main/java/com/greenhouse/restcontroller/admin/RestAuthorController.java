package com.greenhouse.restcontroller.admin;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.google.gson.Gson;
import com.greenhouse.model.Authors;
import com.greenhouse.service.AuthorsService;
import com.greenhouse.util.ImageUploader;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

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
    public ResponseEntity<Object> create(@RequestParam(value = "image", required = false) MultipartFile file,
                                         @RequestParam("authorJson") String authorJson) throws Exception {
        if (authorJson.isEmpty()) {
            return new ResponseEntity<>("Thông tin tác giả không hợp lệ.", HttpStatus.BAD_REQUEST);
        }

        String photoUrl = null;
        if (file != null && !file.isEmpty()) {
                           photoUrl = ImageUploader.uploadImage(file, "author_" + System.currentTimeMillis());
 }

        Authors author = new Gson().fromJson(authorJson, Authors.class);
        if (photoUrl != null) {
            author.setImage(photoUrl);
        }

        Authors existingAuthor = authorsService.findById(author.getAuthorId());
        if (existingAuthor != null) {
            return new ResponseEntity<>("Tác giả đã tồn tại.", HttpStatus.BAD_REQUEST);
        }

        Authors createdAuthor = authorsService.add(author);
        return new ResponseEntity<>(createdAuthor, HttpStatus.OK);
    }

    @PutMapping(value = "/{id}")
    public ResponseEntity<Authors> update(@PathVariable("id") String id,
                                          @RequestParam(value = "image", required = false) MultipartFile file,
                                          @RequestParam("authorJson") String authorJson) throws Exception {

        String photoUrl = null;
        if (file != null && !file.isEmpty()) {
            photoUrl = ImageUploader.uploadImage(file, "author_" + System.currentTimeMillis());
        }

        Authors author = new Gson().fromJson(authorJson, Authors.class);

        if (photoUrl != null) {
            author.setImage(photoUrl);
        } else {
            Authors existingAuthor = authorsService.findById(id);
            if (existingAuthor != null) {
                author.setImage(existingAuthor.getImage());
            }
        }

        author.setAuthorId(id);

        Authors updatedAuthor = authorsService.update(author);
        return ResponseEntity.ok(updatedAuthor);
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
