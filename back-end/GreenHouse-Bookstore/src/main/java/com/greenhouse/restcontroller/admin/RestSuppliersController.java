package com.greenhouse.restcontroller.admin;


import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.google.gson.Gson;
import com.greenhouse.model.Suppliers; // Import Suppliers thay vì Publishers
import com.greenhouse.service.SuppliersService; // Import SuppliersService thay vì PublishersService
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.util.StringUtils;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(value = "/rest/suppliers") // Thay đổi đường dẫn
public class RestSuppliersController {

    @Autowired
    private SuppliersService suppliersService; // Sử dụng SuppliersService thay vì PublishersService


    private static final String CLOUDINARY_CLOUD_NAME = "dmbh3sz8s";
    private static final String CLOUDINARY_API_KEY = "165312227781173";
    private static final String CLOUDINARY_API_SECRET = "xcADjr7hxF6iXNMtsdf2CQAnbOI";

    @GetMapping
    public ResponseEntity<List<Suppliers>> getAllSuppliers() { // Thay đổi tên phương thức và kiểu dữ liệu
        List<Suppliers> suppliers = suppliersService.findAll(); // Sử dụng Suppliers thay vì Publishers
        return new ResponseEntity<>(suppliers, HttpStatus.OK);
    }

    @GetMapping(value = "/{id}")
    public ResponseEntity<Suppliers> getOne(@PathVariable("id") String id) { // Thay đổi tên biến
        Suppliers supplier = suppliersService.findById(id); // Sử dụng Suppliers thay vì Publishers
        if (supplier == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(supplier, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Object> create(@RequestParam(value = "image", required = false) MultipartFile file,
                                         @RequestParam("supplierJson") String supplierJson) throws Exception {
        if (StringUtils.isEmpty(supplierJson)) {
            return new ResponseEntity<>("Thông tin nhà cung cấp không hợp lệ.", HttpStatus.BAD_REQUEST);
        }

        String photoUrl = null;
        if (file != null && !file.isEmpty()) {
            photoUrl = uploadImageToCloudinary(file, "author_" + System.currentTimeMillis());
        }


        // Xử lý thông tin nhà cung cấp
        Suppliers supplier = new Gson().fromJson(supplierJson, Suppliers.class);

        if (photoUrl != null) {
            supplier.setImage(photoUrl);
        }


        Suppliers existingSupplier = suppliersService.findById(supplier.getSupplierId());
        if (existingSupplier != null) {
            return new ResponseEntity<>("Nhà cung cấp đã tồn tại.", HttpStatus.BAD_REQUEST);
        }

        Suppliers createdSupplier = suppliersService.add(supplier);
        return new ResponseEntity<>(createdSupplier, HttpStatus.OK);
    }

    @PutMapping(value = "/{id}")
    public ResponseEntity<Suppliers> update(@PathVariable("id") String id,
                                            @RequestParam(value = "image", required = false) MultipartFile file,
                                            @RequestParam("supplierJson") String supplierJson) throws Exception {

        String photoUrl = null;
        if (file != null && !file.isEmpty()) {
            photoUrl = uploadImageToCloudinary(file, "author_" + System.currentTimeMillis());
        }


        // Xử lý thông tin nhà cung cấp
        Suppliers supplier = new Gson().fromJson(supplierJson, Suppliers.class);

        if (photoUrl != null) {
            supplier.setImage(photoUrl);
        }

        // Cập nhật thông tin nhà cung cấp
        supplier.setSupplierId(id);

        Suppliers updatedSupplier = suppliersService.update(supplier);
        return ResponseEntity.ok(updatedSupplier);
    }

    @DeleteMapping(value = "/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") String id) { // Thay đổi tên biến
        Suppliers existingSupplier = suppliersService.findById(id); // Sử dụng Suppliers thay vì Publishers
        if (existingSupplier == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        suppliersService.delete(id); // Sử dụng Suppliers thay vì Publishers
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
                    "public_id", imageName, // Tên hình ảnh trên Cloudinary
                    "folder", "authors", // Thư mục trên Cloudinary
                    "overwrite", true // Ghi đè nếu hình ảnh đã tồn tại
            ));

            // Lấy URL của hình ảnh đã tải lên từ kết quả
            photoUrl = (String) uploadResult.get("secure_url");
        } catch (IOException e) {
            e.printStackTrace();
            throw new Exception("Lỗi khi tải ảnh lên Cloudinary.");
        }

        return photoUrl;
    }
}
