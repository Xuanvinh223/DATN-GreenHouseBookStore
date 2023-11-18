package com.greenhouse.restcontroller.admin;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.google.gson.Gson;
import com.greenhouse.model.Product_Images;
import com.greenhouse.service.ProductImagesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/rest/productImages")
public class RestProductImageCtrl {

    @Autowired
    private ProductImagesService productImagesService;

    private static final String CLOUDINARY_CLOUD_NAME = "dmbh3sz8s";
    private static final String CLOUDINARY_API_KEY = "165312227781173";
    private static final String CLOUDINARY_API_SECRET = "xcADjr7hxF6iXNMtsdf2CQAnbOI";

    @GetMapping
    public ResponseEntity<List<Product_Images>> getAllProductImages() {
        List<Product_Images> productImages = productImagesService.findAll();
        return new ResponseEntity<>(productImages, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product_Images> getProductImage(@PathVariable("id") Integer id) {
        Product_Images productImage = productImagesService.findById(id);
        if (productImage == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(productImage, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Object> createProductImages(
            @RequestParam(value = "images", required = false) MultipartFile[] files,
            @RequestParam("productImageJson") String productImageJson) {

        if (files == null || files.length == 0) {
            return new ResponseEntity<>("No images provided.", HttpStatus.BAD_REQUEST);
        }

        List<String> uploadedImageUrls = new ArrayList<>();

        try {
            uploadedImageUrls = uploadImagesToCloudinary(files);
        } catch (IOException e) {
            return new ResponseEntity<>("Error uploading images.", HttpStatus.BAD_REQUEST);
        }

        Product_Images[] productImages = new Gson().fromJson(productImageJson, Product_Images[].class);

        for (int i = 0; i < uploadedImageUrls.size(); i++) {
            if (i < productImages.length) {
                productImages[i].setImages(uploadedImageUrls.get(i));
                productImagesService.add(productImages[i]);
            } else {
                break; // Tránh lỗi ArrayIndexOutOfBoundsException nếu uploadedImageUrls nhiều hơn productImages
            }
        }

        return new ResponseEntity<>(productImages, HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProductImage(@PathVariable("id") Integer id) {
        Product_Images existingProductImage = productImagesService.findById(id);
        if (existingProductImage == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        productImagesService.delete(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    private List<String> uploadImagesToCloudinary(MultipartFile[] imageFiles) throws IOException {
        List<String> photoUrls = new ArrayList<>();

        Cloudinary cloudinary = new Cloudinary(ObjectUtils.asMap(
                "cloud_name", CLOUDINARY_CLOUD_NAME,
                "api_key", CLOUDINARY_API_KEY,
                "api_secret", CLOUDINARY_API_SECRET));

        for (MultipartFile imageFile : imageFiles) {
            if (!imageFile.isEmpty()) {
                try {
                    byte[] imageBytes = imageFile.getBytes();

                    String imageName = "product-image-" + System.currentTimeMillis();
                    Map uploadResult = cloudinary.uploader().upload(imageBytes, ObjectUtils.asMap(
                            "public_id", imageName,
                            "folder", "images",
                            "overwrite", true));

                    String photoUrl = (String) uploadResult.get("secure_url");
                    photoUrls.add(photoUrl);
                } catch (IOException e) {
                    e.printStackTrace();
                    throw new IOException("Lỗi khi tải ảnh lên Cloudinary.");
                }
            }
        }

        return photoUrls;
    }
}
