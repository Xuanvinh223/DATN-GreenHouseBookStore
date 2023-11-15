package com.greenhouse.restcontroller.admin;

import com.greenhouse.model.ProductPriceHistories;
import com.greenhouse.service.ProductPriceHistoriesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/rest/productPriceHistories")
public class RestProductPriceHistoriesCtrl {

    @Autowired
    private ProductPriceHistoriesService productPriceHistoriesService;

    @GetMapping
    public ResponseEntity<List<ProductPriceHistories>> getAllProductPriceHistories() {
        List<ProductPriceHistories> productPriceHistoriesList = productPriceHistoriesService.findAll();
        return new ResponseEntity<>(productPriceHistoriesList, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductPriceHistories> getOne(@PathVariable("id") Integer id) {
        ProductPriceHistories productPriceHistories = productPriceHistoriesService.findById(id);
        if (productPriceHistories == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(productPriceHistories, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<ProductPriceHistories> create(@RequestBody ProductPriceHistories productPriceHistories) {
        ProductPriceHistories createdProductPriceHistories = productPriceHistoriesService.add(productPriceHistories);
        return new ResponseEntity<>(createdProductPriceHistories, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductPriceHistories> update(@PathVariable("id") Integer id,
                                                        @RequestBody ProductPriceHistories productPriceHistories) {
        ProductPriceHistories existingProductPriceHistories = productPriceHistoriesService.findById(id);
        if (existingProductPriceHistories == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        productPriceHistories.setPriceHistoriesId(id); // Đảm bảo tính nhất quán về ID
        productPriceHistoriesService.update(productPriceHistories);
        return new ResponseEntity<>(productPriceHistories, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") Integer id) {
        ProductPriceHistories existingProductPriceHistories = productPriceHistoriesService.findById(id);
        if (existingProductPriceHistories == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        productPriceHistoriesService.delete(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
