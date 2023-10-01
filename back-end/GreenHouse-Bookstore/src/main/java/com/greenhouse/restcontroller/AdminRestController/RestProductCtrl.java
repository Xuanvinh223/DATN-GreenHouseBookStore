package com.greenhouse.restcontroller.AdminRestController;

import com.greenhouse.dto.ProductDTO;
import com.greenhouse.model.Authors;
import com.greenhouse.model.Book_Authors;
import com.greenhouse.model.Categories;
import com.greenhouse.model.Discounts;
import com.greenhouse.model.Product_Category;
import com.greenhouse.model.Product_Detail;
import com.greenhouse.model.Product_Discount;
import com.greenhouse.model.Products;
import com.greenhouse.service.BookAuthorsService;
import com.greenhouse.service.ProductCategoryService;
import com.greenhouse.service.ProductDetailService;
import com.greenhouse.service.ProductDiscountService;
import com.greenhouse.service.ProductsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping(value = "/rest/products")
public class RestProductCtrl {

    @Autowired
    private ProductsService productsService;

    @Autowired
    private ProductCategoryService productCategoryService;

    @Autowired
    private BookAuthorsService bookAuthorsService;

    @Autowired
    private ProductDetailService productDetailService;

    @Autowired
    private ProductDiscountService productDiscountService;


    @GetMapping
    public ResponseEntity<List<Products>> getAllProducts() {
        List<Products> products = productsService.findAll();
        return new ResponseEntity<>(products, HttpStatus.OK);
    }

    @GetMapping(value = "/{productId}")
    public ResponseEntity<Products> getOne(@PathVariable("productId") String productId) {
        Products product = productsService.findById(productId);
        if (product == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(product, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<List<Products>> create(@RequestBody ProductDTO data) {
        Products product = data.getProduct();
        Categories category = data.getCategory();
        Authors author = data.getAuthor();
        Discounts discount = data.getDiscount();
        Product_Detail productDetail = data.getProductDetail();

        // Kiểm tra xem discount đã hết hạn chưa
        Date currentDate = new Date();
        if (discount != null && discount.getEndDate() != null && discount.getEndDate().before(currentDate)) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        Products existingProduct = productsService.findById(product.getProductId());
        if (existingProduct != null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        // Tính toán giá giảm dựa trên giá sản phẩm và phần trăm giảm
        double price = productDetail.getPrice();
        double discountPercentage = discount.getValue() / 100.0;
        double priceDiscount = price - (price * discountPercentage);

        productDetail.setPriceDiscount(priceDiscount); // Cập nhật giá giảm vào ProductDetail

        Products createdProduct = productsService.add(product);

        Product_Category productCategory = new Product_Category();
        productCategory.setProduct(createdProduct);
        productCategory.setCategory(category);

        productCategoryService.add(productCategory);

        Book_Authors bookAuthor = new Book_Authors();
        bookAuthor.setProduct(createdProduct);
        bookAuthor.setAuthor(author);
        bookAuthorsService.add(bookAuthor);

        productDetail.setProduct(createdProduct);
        productDetail.setImage(productDetail.getImage());
        productDetail.setProductImageId(productDetail.getProductImageId());

        Product_Detail product_Detail = productDetailService.add(productDetail);

        Product_Discount productDiscount = new Product_Discount();
        productDiscount.setProductDetail(product_Detail);
        productDiscount.setDiscount(discount);
        productDiscountService.add(productDiscount);

        List<Products> updatedProducts = productsService.findAll();
        return new ResponseEntity<>(updatedProducts, HttpStatus.OK);
    }

    @PutMapping(value = "/{productId}")
    public ResponseEntity<Products> update(@PathVariable("productId") String productId, @RequestBody ProductDTO data) {
        Products existingProduct = productsService.findById(productId);
        if (existingProduct == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        Products product = data.getProduct();
        // Cập nhật thông tin sản phẩm
        productsService.update(product);

        return new ResponseEntity<>(product, HttpStatus.OK);
    }


    @DeleteMapping(value = "/{productId}")
    public ResponseEntity<Void> delete(@PathVariable("productId") String productId) {
        Products existingProduct = productsService.findById(productId);
        if (existingProduct == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        productsService.delete(productId);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
