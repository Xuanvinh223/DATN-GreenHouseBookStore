package com.greenhouse.restcontroller.admin;

import com.google.gson.Gson;
import com.greenhouse.model.Suppliers; // Import Suppliers thay vì Publishers
import com.greenhouse.service.SuppliersService; // Import SuppliersService thay vì PublishersService
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
@RequestMapping(value = "/rest/suppliers") // Thay đổi đường dẫn
public class RestSuppliersController {

    @Autowired
    private SuppliersService suppliersService; // Sử dụng SuppliersService thay vì PublishersService
    @Value("${upload.path}")
    private String uploadPath;

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
            @RequestParam("supplierJson") String supplierJson) {
        if (StringUtils.isEmpty(supplierJson)) {
            return new ResponseEntity<>("Thông tin nhà cung cấp không hợp lệ.", HttpStatus.BAD_REQUEST);
        }

        // Xử lý tải lên ảnh
        String uploadedFileName = null;
        if (file != null && !file.isEmpty()) {
            try {
                String originalFileName = file.getOriginalFilename();
                String fileExtension = FilenameUtils.getExtension(originalFileName);
                uploadedFileName = "supplier_" + System.currentTimeMillis() + "." + fileExtension;
                File uploadedFile = new File(uploadPath + File.separator + uploadedFileName);
                FileUtils.writeByteArrayToFile(uploadedFile, file.getBytes());
            } catch (IOException e) {
                return new ResponseEntity<>("Lỗi khi tải ảnh lên.", HttpStatus.BAD_REQUEST);
            }
        }

        // Xử lý thông tin nhà cung cấp
        Suppliers supplier = new Gson().fromJson(supplierJson, Suppliers.class);

        // Kiểm tra xem ảnh đã tải lên mới chưa và ảnh không null
        if (uploadedFileName != null) {
            supplier.setImage(uploadedFileName);
        } else {
            supplier.setImage(null); // Đặt ảnh thành null nếu không có ảnh
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
            @RequestParam("supplierJson") String supplierJson) {

        // Xử lý tải lên ảnh (nếu có)
        String uploadedFileName = null;
        if (file != null && !file.isEmpty()) {
            try {
                String originalFileName = file.getOriginalFilename();
                String fileExtension = FilenameUtils.getExtension(originalFileName);
                uploadedFileName = "supplier_" + System.currentTimeMillis() + "." + fileExtension;
                File uploadedFile = new File(uploadPath + File.separator + uploadedFileName);
                FileUtils.writeByteArrayToFile(uploadedFile, file.getBytes());
            } catch (IOException e) {
                e.printStackTrace();
                return ResponseEntity.badRequest().build();
            }
        }

        // Chuyển đổi dữ liệu nhà cung cấp từ JSON thành đối tượng Suppliers
        Suppliers supplier = new Gson().fromJson(supplierJson, Suppliers.class);

        // Kiểm tra xem ảnh đã tải lên mới chưa và ảnh không null
        if (uploadedFileName != null) {
            supplier.setImage(uploadedFileName);
        } else {
            supplier.setImage(null); // Đặt ảnh thành null nếu không có ảnh
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
}
