package com.greenhouse.restcontroller.admin;

import com.greenhouse.model.Product_Images;
import com.greenhouse.service.ProductImagesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/rest/productImages")
public class RestProductImageCtrl {

    @Autowired
    private ProductImagesService productImagesService;

  

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

    
     @DeleteMapping("/images/{imageId}")
public ResponseEntity<?> deleteProductImage(@PathVariable("imageId") Integer imageId) {
    try {
        // Gọi phương thức xóa ảnh từ service
        productImagesService.delete(imageId);
        return new ResponseEntity<>(HttpStatus.OK);
    } catch (Exception e) {
        return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    }
}


  
}
