package com.greenhouse.restcontroller.AdminRestController;

import com.greenhouse.model.Brand;
import com.greenhouse.service.BrandService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/brand")
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
            return ResponseEntity.ok(brand);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<Brand> addBrand(@RequestBody Brand brand) {
        brandService.add(brand);
        return ResponseEntity.status(HttpStatus.CREATED).build();
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

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBrand(@PathVariable String id) {
        Brand brand = brandService.findById(id);
        if (brand != null) {
            brandService.delete(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
