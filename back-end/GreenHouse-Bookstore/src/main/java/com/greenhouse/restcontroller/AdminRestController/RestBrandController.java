package com.greenhouse.restcontroller.AdminRestController;

import com.greenhouse.model.Authors;
import com.greenhouse.model.Brand;
import com.greenhouse.service.BrandService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("*")
@RequestMapping(value = "/rest/brand")
public class RestBrandController {

    @Autowired
    private BrandService brandService;

    @GetMapping
    public ResponseEntity<List<Brand>> getAllBrand() {
        List<Brand> brandList = brandService.findAll();
        return ResponseEntity.ok(brandList);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Brand> getBrandById(@PathVariable String id) {
        Brand brand = brandService.findById(id);
        if (brand != null) {
            return ResponseEntity.notFound().build();
        } else {
            
            return ResponseEntity.ok(brand);
        }
    }

    @PostMapping
    private ResponseEntity<?> create(@RequestBody Brand brand) {
        // Kiểm tra nếu authorId là null hoặc rỗng thì trả về lỗi
        if (brand.getBrandId() == null || brand.getBrandId().isEmpty()) {
            return ResponseEntity.badRequest().body("Mã thương hiệu không hợp lệ.");
        }
    
        Brand existingBrand = brandService.findById(brand.getBrandId());
        if (existingBrand != null) {
            return ResponseEntity.badRequest().body("Thương hiệu đã tồn tại.");
        }
        
        Brand createdBrand = brandService.add(brand);
        return ResponseEntity.ok(createdBrand);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> updateBrand(@PathVariable String id, @RequestBody Brand updateBrand) {
        Brand existingBrand = brandService.findById(id);
        if (existingBrand != null) {
            updateBrand.setBrandId(existingBrand.getBrandId());
            brandService.update(updateBrand);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping(value = "/{id}")
    private ResponseEntity<Void> delete(@PathVariable("id") String id) {
        Brand existingBrand = brandService.findById(id);
        if (existingBrand == null) {
            return ResponseEntity.notFound().build();
        }
        brandService.delete(id);
        return ResponseEntity.ok().build();
    }
}
