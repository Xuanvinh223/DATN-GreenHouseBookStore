package com.greenhouse.restcontroller.admin;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.google.gson.Gson;
import com.greenhouse.model.Publishers;
import com.greenhouse.service.PublishersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.util.StringUtils;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(value = "/rest/publishers") // Thay đổi đường dẫn
public class RestPublishersController {

    @Autowired
    private PublishersService publishersService;

    private static final String CLOUDINARY_CLOUD_NAME = "dmbh3sz8s";
    private static final String CLOUDINARY_API_KEY = "165312227781173";
    private static final String CLOUDINARY_API_SECRET = "xcADjr7hxF6iXNMtsdf2CQAnbOI";


    @GetMapping
    public ResponseEntity<List<Publishers>> getAllPublishers() {
        List<Publishers> publishers = publishersService.findAll();
        return new ResponseEntity<>(publishers, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Publishers> getPublisher(@PathVariable String id) {
        Publishers publisher = publishersService.findById(id);
        if (publisher == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(publisher, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Object> createPublisher(@RequestParam(value = "image", required = false) MultipartFile file,
                                                @RequestParam("publisherJson") String publisherJson) throws Exception {
        if (StringUtils.isEmpty(publisherJson)) {
            return new ResponseEntity<>("Thông tin nhà xuất bản không hợp lệ.", HttpStatus.BAD_REQUEST);
        }

        String photoUrl = null;
        if (file != null && !file.isEmpty()) {
            photoUrl = uploadImageToCloudinary(file, "publisher_" + System.currentTimeMillis());
        }

        Publishers publisher = new Gson().fromJson(publisherJson, Publishers.class);

        if (photoUrl != null) {
            publisher.setImage(photoUrl);
        }

        Publishers existingPublisher = publishersService.findById(publisher.getPublisherId());
        if (existingPublisher != null) {
            return new ResponseEntity<>("Nhà xuất bản đã tồn tại.", HttpStatus.BAD_REQUEST);
        }

        Publishers createdPublisher = publishersService.add(publisher);
        return new ResponseEntity<>(createdPublisher, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Publishers> updatePublisher(@PathVariable String id,
                                                  @RequestParam(value = "image", required = false) MultipartFile file,
                                                  @RequestParam("publisherJson") String publisherJson) throws Exception {
        String photoUrl = null;
        if (file != null && !file.isEmpty()) {
            photoUrl = uploadImageToCloudinary(file, "publisher_" + System.currentTimeMillis());
        }

        Publishers publisher = new Gson().fromJson(publisherJson, Publishers.class);

        if (photoUrl != null) {
            publisher.setImage(photoUrl);
        }

        publisher.setPublisherId(id);

        Publishers updatedPublisher = publishersService.update(publisher);
        return ResponseEntity.ok(updatedPublisher);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePublisher(@PathVariable String id) {
        Publishers existingPublisher = publishersService.findById(id);
        if (existingPublisher == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        publishersService.delete(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }
    private String uploadImageToCloudinary(MultipartFile imageFile, String imageName) throws Exception {
        String photoUrl = null;

        try {
            Cloudinary cloudinary = new Cloudinary(ObjectUtils.asMap(
                    "cloud_name", CLOUDINARY_CLOUD_NAME,
                    "api_key", CLOUDINARY_API_KEY,
                    "api_secret", CLOUDINARY_API_SECRET));

            byte[] imageBytes = imageFile.getBytes();

            Map uploadResult = cloudinary.uploader().upload(imageBytes, ObjectUtils.asMap(
                    "public_id", imageName,
                    "folder", "images", // Thư mục trên Cloudinary (có thể thay đổi)
                    "overwrite", true
            ));

            photoUrl = (String) uploadResult.get("secure_url");
        } catch (IOException e) {
            e.printStackTrace();
            throw new Exception("Lỗi khi tải ảnh lên Cloudinary.");
        }

        return photoUrl;
    }
}
