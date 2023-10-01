package com.greenhouse.restcontroller.admin;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.storage.*;
import com.google.gson.Gson;
import com.greenhouse.model.Authors;
import com.greenhouse.service.AuthorsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;

@RestController
@RequestMapping(value = "/rest/authors")
public class RestAuthorController {

    @Autowired
    private AuthorsService authorsService;


    private String bucketName = "greenhouse-bookstore";

    private String credentialsPath = "/static/images/greenhouse-396915-688460e6dcea.json";

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
        if (authorJson.isEmpty()) {
            return new ResponseEntity<>("Thông tin tác giả không hợp lệ.", HttpStatus.BAD_REQUEST);
        }

        String uploadedImageUrl = null;
        if (file != null && !file.isEmpty()) {
            try {
                uploadedImageUrl = uploadImageToCloudStorage(file, "author_" + System.currentTimeMillis());
            } catch (IOException e) {
                return new ResponseEntity<>("Lỗi khi tải ảnh lên.", HttpStatus.BAD_REQUEST);
            }
        }

        Authors author = new Gson().fromJson(authorJson, Authors.class);
        if (uploadedImageUrl != null) {
            author.setImage(uploadedImageUrl);
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
                                          @RequestParam("authorJson") String authorJson) {

        String uploadedImageUrl = null;
        if (file != null && !file.isEmpty()) {
            try {
                uploadedImageUrl = uploadImageToCloudStorage(file, "author_" + System.currentTimeMillis());
            } catch (IOException e) {
                e.printStackTrace();
                return ResponseEntity.badRequest().build();
            }
        }

        Authors author = new Gson().fromJson(authorJson, Authors.class);

        if (uploadedImageUrl != null) {
            author.setImage(uploadedImageUrl);
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

    private String uploadImageToCloudStorage(MultipartFile imageFile, String imageName) throws IOException {
        // Sử dụng getResourceAsStream để truy cập tệp JSON từ đường dẫn tương đối
        InputStream credentialsStream = getClass().getResourceAsStream(credentialsPath);
        GoogleCredentials credentials = GoogleCredentials.fromStream(credentialsStream);
        Storage storage = StorageOptions.newBuilder().setCredentials(credentials).build().getService();
        String folderName = "authors";
        BlobId blobId = BlobId.of(bucketName, folderName + "/" + imageName);
        BlobInfo blobInfo = BlobInfo.newBuilder(blobId).setContentType(imageFile.getContentType()).build();
        Blob blob = storage.create(blobInfo, imageFile.getBytes());
        return "https://storage.cloud.google.com/" + bucketName + "/" + blob.getName();
    }
}
