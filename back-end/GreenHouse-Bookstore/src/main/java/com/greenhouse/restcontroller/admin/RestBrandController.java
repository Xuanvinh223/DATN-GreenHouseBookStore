package com.greenhouse.restcontroller.admin;

import com.greenhouse.model.Brands;
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
    public ResponseEntity<List<Brands>> getAllBrand() {
        List<Brands> brand = brandService.findAll();
        return new ResponseEntity<>(brand, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Brands> getOne(@PathVariable("id") String id) {
        Brands brand = brandService.findById(id);
        if (brand == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } else {

            return new ResponseEntity<>(brand, HttpStatus.OK);
        }
    }

    @PostMapping
    private ResponseEntity<?> create(@RequestBody Brands brand) {
        // Kiểm tra nếu authorId là null hoặc rỗng thì trả về lỗi
        if (brand.getBrandId() == null || brand.getBrandId().isEmpty()) {
            return ResponseEntity.badRequest().body("Mã thương hiệu không hợp lệ.");
        }

        Brands existingBrand = brandService.findById(brand.getBrandId());
        if (existingBrand != null) {
            return ResponseEntity.badRequest().body("Thương hiệu đã tồn tại.");
        }

        Brands createdBrand = brandService.add(brand);
        return ResponseEntity.ok(createdBrand);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Brands> update(@PathVariable String id, @RequestBody Brands brand) {
        Brands existingBrand = brandService.findById(id);
        if (existingBrand == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        brand.setBrandId(id); // Đảm bảo tính nhất quán về ID
        brandService.update(brand);
        return new ResponseEntity<>(brand, HttpStatus.OK);
    }

    @DeleteMapping(value = "/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") String id) {
        Brands existingBrand = brandService.findById(id);
        if (existingBrand == null) {
            return ResponseEntity.notFound().build();
        }
        brandService.delete(id);
        return ResponseEntity.ok().build();
    }
}
