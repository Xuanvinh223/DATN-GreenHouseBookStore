package com.greenhouse.restcontroller.admin;

import com.google.gson.Gson;
import com.greenhouse.model.Authors;
import com.greenhouse.service.AuthorsService;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.FilenameUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.util.StringUtils;

import java.io.File;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping(value = "/rest/authors")
public class RestAuthorController {

    @Autowired
    private AuthorsService authorsService;
    @Value("${upload.path}")
    private String uploadPath;

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
                                         @RequestParam("authorJson") String authorJson) {
        if (StringUtils.isEmpty(authorJson)) {
            return new ResponseEntity<>("Thông tin tác giả không hợp lệ.", HttpStatus.BAD_REQUEST);
        }

        String uploadedFileName = null;
        if (file != null && !file.isEmpty()) {
            try {
                String originalFileName = file.getOriginalFilename();
                String fileExtension = FilenameUtils.getExtension(originalFileName);
                uploadedFileName = "author_" + System.currentTimeMillis() + "." + fileExtension;
                File uploadedFile = new File(uploadPath + File.separator + uploadedFileName);
                FileUtils.writeByteArrayToFile(uploadedFile, file.getBytes());
            } catch (IOException e) {
                return new ResponseEntity<>("Lỗi khi tải ảnh lên.", HttpStatus.BAD_REQUEST);
            }
        }

        Authors author = new Gson().fromJson(authorJson, Authors.class);
        author.setImage(uploadedFileName);

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
                                          @RequestParam("authorJson") String authorJson) {

        String uploadedFileName = null;
        if (file != null && !file.isEmpty()) {
            try {
                String originalFileName = file.getOriginalFilename();
                String fileExtension = FilenameUtils.getExtension(originalFileName);
                uploadedFileName = "author_" + System.currentTimeMillis() + "." + fileExtension;
                File uploadedFile = new File(uploadPath + File.separator + uploadedFileName);
                FileUtils.writeByteArrayToFile(uploadedFile, file.getBytes());
            } catch (IOException e) {
                e.printStackTrace();
                return ResponseEntity.badRequest().build();
            }
        }

        Authors author = new Gson().fromJson(authorJson, Authors.class);

        // Kiểm tra xem ảnh đã tải lên mới chưa
        if (uploadedFileName != null) {
            author.setImage(uploadedFileName);
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
