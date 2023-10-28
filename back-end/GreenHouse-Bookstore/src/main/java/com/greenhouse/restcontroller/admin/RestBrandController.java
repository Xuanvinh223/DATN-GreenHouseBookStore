package com.greenhouse.restcontroller.admin;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.google.gson.Gson;
import com.greenhouse.model.Brands;
import com.greenhouse.service.BrandService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin("*")
@RequestMapping(value = "/rest/brand")
public class RestBrandController {

    @Autowired
    private BrandService brandService;

    private static final String CLOUDINARY_CLOUD_NAME = "dmbh3sz8s";
    private static final String CLOUDINARY_API_KEY = "165312227781173";
    private static final String CLOUDINARY_API_SECRET = "xcADjr7hxF6iXNMtsdf2CQAnbOI";

    @GetMapping
    public ResponseEntity<List<Brands>> getAllBrand() {
        List<Brands> brand = brandService.findAll();
        return new ResponseEntity<>(brand, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Brands> getOne(@PathVariable("id") String id) {
        Brands brand = brandService.findById(id);
        if (brand == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(brand, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Object> create(@RequestParam(value = "image", required = false) MultipartFile file,
                                         @RequestParam("brandJson") String brandJson) throws Exception {
        if (brandJson.isEmpty()) {
            return new ResponseEntity<>("Thông tin thương hiệu không hợp lệ.", HttpStatus.BAD_REQUEST);
        }

        String photoUrl = null;
        if (file != null && !file.isEmpty()) {
            photoUrl = uploadImageToCloudinary(file, "brand_" + System.currentTimeMillis());
        }

        Brands brand = new Gson().fromJson(brandJson, Brands.class);
        if (photoUrl != null) {
            brand.setLogo(photoUrl);
        }

        Brands existingBrand = brandService.findById(brand.getBrandId());
        if (existingBrand != null) {
            return new ResponseEntity<>("Thương hiệu đã tồn tại.", HttpStatus.BAD_REQUEST);
        }

        Brands createdBrand = brandService.add(brand);
        return new ResponseEntity<>(createdBrand, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Brands> update(@PathVariable String id,
                                         @RequestParam(value = "image", required = false) MultipartFile file,
                                         @RequestParam("brandJson") String brandJson) throws Exception {
        String photoUrl = null;
        if (file != null && !file.isEmpty()) {
            photoUrl = uploadImageToCloudinary(file, "brand_" + System.currentTimeMillis());
        }

        Brands brand = new Gson().fromJson(brandJson, Brands.class);

        if (photoUrl != null) {
            brand.setLogo(photoUrl);
        } else {
            Brands existingBrand = brandService.findById(id);
            if (existingBrand != null) {
                brand.setLogo(existingBrand.getLogo());
            }
        }

        brand.setBrandId(id);

        Brands updatedBrand = brandService.add(brand);
        return ResponseEntity.ok(updatedBrand);
    }

    @DeleteMapping(value = "/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") String id) {
        Brands existingBrand = brandService.findById(id);
        if (existingBrand == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        brandService.delete(id);
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
                    "folder", "brands",
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
