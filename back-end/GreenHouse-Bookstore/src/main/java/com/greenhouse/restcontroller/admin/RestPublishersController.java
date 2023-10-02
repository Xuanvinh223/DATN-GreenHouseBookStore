package com.greenhouse.restcontroller.admin;

import com.google.gson.Gson;
import com.greenhouse.model.Publishers;
import com.greenhouse.service.PublishersService;
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
@RequestMapping(value = "/rest/publishers")
public class RestPublishersController {

    @Autowired
    private PublishersService publishersService;
    
    @Value("${upload.path}")
    private String uploadPath;

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
    public ResponseEntity<Object> create(@RequestParam(value = "image", required = false) MultipartFile file, @RequestParam("publisherJson") String publisherJson) {
        if (StringUtils.isEmpty(publisherJson)) {
            return new ResponseEntity<>("Thông tin nhà xuất bản không hợp lệ.", HttpStatus.BAD_REQUEST);
        }
    
        // Xử lý tải lên ảnh nếu có
        String uploadedFileName = null;
        if (file != null && !file.isEmpty()) {
            try {
                String originalFileName = file.getOriginalFilename();
                String fileExtension = FilenameUtils.getExtension(originalFileName);
                uploadedFileName = "publisher_" + System.currentTimeMillis() + "." + fileExtension;
                File uploadedFile = new File(uploadPath + File.separator + uploadedFileName);
                FileUtils.writeByteArrayToFile(uploadedFile, file.getBytes());
            } catch (IOException e) {
                return new ResponseEntity<>("Lỗi khi tải ảnh lên.", HttpStatus.BAD_REQUEST);
            }
        }
    
        // Xử lý thông tin nhà xuất bản
        Publishers publisher = new Gson().fromJson(publisherJson, Publishers.class);
    
        // Kiểm tra xem ảnh đã tải lên mới chưa và ảnh không null
        if (uploadedFileName != null) {
            publisher.setImage(uploadedFileName);
        } else {
            publisher.setImage(null); // Đặt ảnh thành null nếu không có ảnh
        }
    
        Publishers existingPublisher = publishersService.findById(publisher.getPublisherId());
        if (existingPublisher != null) {
            return new ResponseEntity<>("Nhà xuất bản đã tồn tại.", HttpStatus.BAD_REQUEST);
        }
    
        Publishers createdPublisher = publishersService.add(publisher);
        return new ResponseEntity<>(createdPublisher, HttpStatus.OK);
    }
    
    @PutMapping(value = "/{id}")
    public ResponseEntity<Publishers> update(@PathVariable("id") String id,
                                            @RequestParam(value = "image", required = false) MultipartFile file,
                                            @RequestParam("publisherJson") String publisherJson) {
    
        // Xử lý tải lên ảnh (nếu có)
        String uploadedFileName = null;
        if (file != null && !file.isEmpty()) {
            try {
                String originalFileName = file.getOriginalFilename();
                String fileExtension = FilenameUtils.getExtension(originalFileName);
                uploadedFileName = "publisher_" + System.currentTimeMillis() + "." + fileExtension;
                File uploadedFile = new File(uploadPath + File.separator + uploadedFileName);
                FileUtils.writeByteArrayToFile(uploadedFile, file.getBytes());
            } catch (IOException e) {
                e.printStackTrace();
                return ResponseEntity.badRequest().build();
            }
        }
    
        // Chuyển đổi dữ liệu nhà xuất bản từ JSON thành đối tượng Publishers
        Publishers publisher = new Gson().fromJson(publisherJson, Publishers.class);
    
        // Kiểm tra xem ảnh đã tải lên mới chưa và ảnh không null
        if (uploadedFileName != null) {
            publisher.setImage(uploadedFileName);
        } else {
            publisher.setImage(null); // Đặt ảnh thành null nếu không có ảnh
        }
    
        // Cập nhật thông tin nhà xuất bản
        publisher.setPublisherId(id);
    
        Publishers updatedPublisher = publishersService.update(publisher);
        return ResponseEntity.ok(updatedPublisher);
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