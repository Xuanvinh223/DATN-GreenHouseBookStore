package com.greenhouse.restcontroller.client;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.greenhouse.model.Book_Authors;
import com.greenhouse.model.Brands;
import com.greenhouse.model.Categories;
import com.greenhouse.model.CategoryTypes;
import com.greenhouse.model.Product_Detail;
import com.greenhouse.model.Product_Discount;
import com.greenhouse.model.Product_Reviews;
import com.greenhouse.repository.BookAuthorsRepository;
import com.greenhouse.repository.BrandRepository;
import com.greenhouse.repository.CategoriesRepository;
import com.greenhouse.repository.CategoryTypesRepository;
import com.greenhouse.repository.ProductDetailRepository;
import com.greenhouse.repository.ProductDiscountRepository;
import com.greenhouse.repository.ProductReviewsRepository;

@RestController
@RequestMapping("/customer/rest/product-page")
public class ProductPageController {

    @Autowired
    private ProductDetailRepository productDetailRepository;
    @Autowired
    private CategoryTypesRepository categoryTypesRepository;
    @Autowired
    private CategoriesRepository categoriesRepository;
    @Autowired
    private BookAuthorsRepository bookAuthorsRepository;
    @Autowired
    private ProductDiscountRepository productDiscountRepository;
    @Autowired
    private ProductReviewsRepository productReviewsRepository;
    @Autowired
    private BrandRepository brandRepository;

    @GetMapping("/data")
    public ResponseEntity<Map<String, Object>> getData() {
        Map<String, Object> response = new HashMap<String, Object>();

        List<Product_Detail> listProductDetail = productDetailRepository.findAll();
        List<CategoryTypes> listCategoryTypes = categoryTypesRepository.findAll();
        List<Categories> listCategories = categoriesRepository.findAll();
        List<Book_Authors> listBookAuthor = bookAuthorsRepository.findAll();
        List<Product_Discount> listProductDiscount = productDiscountRepository.findAll();
        List<Product_Reviews> listProductReviews = productReviewsRepository.findAll();
        List<Brands> listBrands = brandRepository.findAll();

        response.put("listProductDetail", listProductDetail);
        response.put("listCategoryTypes", listCategoryTypes);
        response.put("listCategories", listCategories);
        response.put("listBookAuthor", listBookAuthor);
        response.put("listProductDiscount", listProductDiscount);
        response.put("listProductReviews", listProductReviews);
        response.put("listBrands", listBrands);
        return ResponseEntity.ok(response);
    }
}
