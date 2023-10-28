package com.greenhouse.restcontroller.client;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.greenhouse.model.Book_Authors;
import com.greenhouse.model.Brands;
import com.greenhouse.model.Product_Detail;
import com.greenhouse.model.Product_Discount;
import com.greenhouse.model.Product_Reviews;
import com.greenhouse.repository.BookAuthorsRepository;
import com.greenhouse.repository.BrandRepository;
import com.greenhouse.repository.ProductDetailRepository;
import com.greenhouse.repository.ProductDiscountRepository;
import com.greenhouse.repository.ProductReviewsRepository;
import com.greenhouse.repository.ProductsRepository;
import com.greenhouse.service.ProductDetailService;

@CrossOrigin("*")
@RestController
@RequestMapping("/customer")
public class IndexController {

    @Autowired
    ProductsRepository productsReps;
    @Autowired
    BrandRepository brandReps;
    @Autowired
    ProductDetailRepository productDetailReps;
    @Autowired
    private ProductDiscountRepository productDiscountRepository;
    @Autowired
    private ProductReviewsRepository productReviewsRepository;
    @Autowired
    private BookAuthorsRepository bookAuthorsRepository;

    

    @GetMapping("/rest/getDataIndex")
    public ResponseEntity<Map<String, Object>> getDataIndex() {
        Map<String, Object> resp = new HashMap<>();

        List<Object[]> sellingProducts = productsReps.SellingProduct();
        List<Brands> sellingBrands = brandReps.findBrandsWithSales();
        List<Product_Detail> listProduct_Details = productDetailReps.findAll();
        List<Product_Discount> listProductDiscount = productDiscountRepository.findAll();
        List<Product_Reviews> listProductReviews = productReviewsRepository.findAll();
        List<Book_Authors> listBookAuthor = bookAuthorsRepository.findAll();

    
        resp.put("listProduct_Details", listProduct_Details);
        resp.put("sellingBrands", sellingBrands);
        resp.put("sellingProducts", sellingProducts);
        resp.put("listProductDiscount", listProductDiscount);
        resp.put("listProductReviews", listProductReviews);
        resp.put("listBookAuthor", listBookAuthor);
        return ResponseEntity.ok(resp);
    }

    @GetMapping("/rest/getProductsByBrand/{brandId}")
    public ResponseEntity<List<Product_Detail>> getProductsByBrand(@PathVariable String brandId) {
        List<Product_Detail> products = productDetailReps.findProductDetailsByProduct_Brand_BrandId(brandId);
        return ResponseEntity.ok(products);
    }

}
