package com.greenhouse.restcontroller.admin;

import com.greenhouse.model.Product_Detail;
import com.greenhouse.model.Product_Discount;
import com.greenhouse.service.ProductDiscountService;
import com.greenhouse.dto.ProductDiscountRequest;
import com.greenhouse.model.Discounts;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "/rest/product_discount")
public class RestProductDiscountCtrl {

    @Autowired
    private ProductDiscountService productDiscountService;

    @GetMapping
    public ResponseEntity<List<Product_Discount>> getAllProductDiscounts() {
        List<Product_Discount> productDiscounts = productDiscountService.findAll();
        return new ResponseEntity<>(productDiscounts, HttpStatus.OK);
    }

    @GetMapping(value = "/{id}")
    public ResponseEntity<Product_Discount> getOne(@PathVariable("id") int id) {
        Product_Discount productDiscount = productDiscountService.findById(id);
        if (productDiscount == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(productDiscount, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Object> create(@RequestBody ProductDiscountRequest productDiscountRequest) {

        // Kiểm tra xem Discounts có tồn tại không
        Discounts discount = productDiscountRequest.getDiscount();
        if (discount == null) {
            return new ResponseEntity<>("Discounts không tồn tại.", HttpStatus.BAD_REQUEST);
        }

        // Xử lý danh sách sản phẩm được chọn
        List<Product_Detail> selectedProductDetails = productDiscountRequest.getProductDetails();
        if (selectedProductDetails == null || selectedProductDetails.isEmpty()) {
            return new ResponseEntity<>("Danh sách sản phẩm không được để trống.", HttpStatus.BAD_REQUEST);
        }

        for (Product_Detail selectedProductDetail : selectedProductDetails) {
            Product_Discount productDiscount = new Product_Discount();
            productDiscount.setDiscount(discount);
            productDiscount.setProductDetail(selectedProductDetail);

            productDiscountService.add(productDiscount);
        }

        return new ResponseEntity<>("Chiến dịch giảm giá đã được tạo thành công.", HttpStatus.OK);
    }

    @PutMapping(value = "/{id}")
    public ResponseEntity<Product_Discount> update(@PathVariable("id") int id,
            @RequestBody ProductDiscountRequest productDiscountRequest) {
        Product_Discount existingProductDiscount = productDiscountService.findById(id);
        if (existingProductDiscount == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        // Kiểm tra xem Discounts có tồn tại không
        Discounts discount = productDiscountRequest.getDiscount();
        if (discount == null) {
        }

        // Xử lý danh sách sản phẩm được chọn
        List<Product_Detail> selectedProductDetails = productDiscountRequest.getProductDetails();
        if (selectedProductDetails == null || selectedProductDetails.isEmpty()) {
        }

        // Thêm sản phẩm mới vào chiến dịch giảm giá
        for (Product_Detail selectedProductDetail : selectedProductDetails) {
            Product_Discount productDiscount = new Product_Discount();
            productDiscount.setDiscount(discount);
            productDiscount.setProductDetail(selectedProductDetail);

            productDiscountService.add(productDiscount);
        }

        return new ResponseEntity<>(existingProductDiscount, HttpStatus.OK);
    }

    @DeleteMapping(value = "/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") int id) {
        Product_Discount existingProductDiscount = productDiscountService.findById(id);
        if (existingProductDiscount == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        productDiscountService.delete(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    
}
