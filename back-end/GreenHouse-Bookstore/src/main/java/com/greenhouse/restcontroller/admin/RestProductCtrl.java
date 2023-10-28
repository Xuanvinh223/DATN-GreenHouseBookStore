package com.greenhouse.restcontroller.AdminRestController;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.google.gson.Gson;
import com.greenhouse.dto.ProductDTO;
import com.greenhouse.model.Authentic_Photos;
import com.greenhouse.model.Book_Authors;
import com.greenhouse.model.Product_Category;
import com.greenhouse.model.Product_Detail;
import com.greenhouse.model.Product_Discount;
import com.greenhouse.model.Product_Images;
import com.greenhouse.model.Products;
import com.greenhouse.service.BookAuthorsService;
import com.greenhouse.service.ProductCategoryService;
import com.greenhouse.service.ProductDetailService;
import com.greenhouse.service.ProductDiscountService;
import com.greenhouse.service.ProductImagesService;
import com.greenhouse.service.ProductsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

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

    @Autowired
    private ProductImagesService productImagesService;

    private static final String CLOUDINARY_CLOUD_NAME = "dmbh3sz8s";
    private static final String CLOUDINARY_API_KEY = "165312227781173";
    private static final String CLOUDINARY_API_SECRET = "xcADjr7hxF6iXNMtsdf2CQAnbOI";

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
    public ResponseEntity<List<Products>> create(
            @RequestParam(value = "image", required = false) MultipartFile imageFile,
            @RequestParam("file") MultipartFile[] files, // Chấp nhận nhiều hình ảnh
            @RequestParam(value = "dataJson") String dataJson) throws Exception {

        if (dataJson.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        String photoUrl = null;
        if (imageFile != null && !imageFile.isEmpty()) {
            photoUrl = uploadImageToCloudinary(imageFile, "product_details" + System.currentTimeMillis());
        }

        ProductDTO data = new Gson().fromJson(dataJson, ProductDTO.class);

        // Kiểm tra xem discount đã hết hạn chưa
        Date currentDate = new Date();
        if (data.getDiscount() != null && data.getDiscount().getEndDate() != null
                && data.getDiscount().getEndDate().before(currentDate)) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        Products existingProduct = productsService.findById(data.getProduct().getProductId());
        if (existingProduct != null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        double price = data.getProductDetail().getPrice();
        double discountPercentage = data.getDiscount().getValue() / 100.0;
        double priceDiscount = price - (price * discountPercentage);

        data.getProductDetail().setPriceDiscount(priceDiscount);

        Products createdProduct = productsService.add(data.getProduct());

        Product_Category productCategory = new Product_Category();
        productCategory.setProduct(createdProduct);
        productCategory.setCategory(data.getCategory());
        productCategoryService.add(productCategory);

        Book_Authors bookAuthor = new Book_Authors();
        bookAuthor.setProduct(createdProduct);
        bookAuthor.setAuthor(data.getAuthor());
        bookAuthorsService.add(bookAuthor);

        data.getProductDetail().setProduct(createdProduct);
        if (photoUrl != null) {
            data.getProductDetail().setImage(photoUrl);
        }
        Product_Detail productDetail = productDetailService.add(data.getProductDetail());

        Product_Discount productDiscount = new Product_Discount();
        productDiscount.setProductDetail(productDetail);
        productDiscount.setDiscount(data.getDiscount());
        productDiscountService.add(productDiscount);

        List<Product_Images> savedImages = new ArrayList<>();

        if (productDetail != null) {
            // Tải lên nhiều tệp hình ảnh lên Cloudinary
            List<String> cloudinaryUrls = uploadImagesToCloudinary(files, "productImages_" + System.currentTimeMillis());

            for (String cloudinaryUrl : cloudinaryUrls) {
                // Tạo đối tượng Product_Images và lưu thông tin
                Product_Images pdImages = new Product_Images();
                pdImages.setImages(cloudinaryUrl); // Lưu URL thật của ảnh
                pdImages.setProductDetail(productDetail);

                // Lưu đối tượng Product_Images vào cơ sở dữ liệu
                productImagesService.add(pdImages);

                savedImages.add(pdImages);
            }
        }

        List<Products> updatedProducts = productsService.findAll();
        return new ResponseEntity<>(updatedProducts, HttpStatus.OK);
    }

    private String uploadImageToCloudinary(MultipartFile imageFile, String imageName) throws IOException {
        String photoUrl = null;

        try {
            Cloudinary cloudinary = new Cloudinary(ObjectUtils.asMap(
                    "cloud_name", CLOUDINARY_CLOUD_NAME,
                    "api_key", CLOUDINARY_API_KEY,
                    "api_secret", CLOUDINARY_API_SECRET));

            byte[] imageBytes = imageFile.getBytes();

            Map uploadResult = cloudinary.uploader().upload(imageBytes, ObjectUtils.asMap(
                    "public_id", imageName,
                    "folder", "product-details",
                    "overwrite", true
            ));

            photoUrl = (String) uploadResult.get("secure_url");
        } catch (IOException e) {
            e.printStackTrace();
            throw new IOException("Lỗi khi tải ảnh lên Cloudinary.");
        }

        return photoUrl;
    }

    private List<String> uploadImagesToCloudinary(MultipartFile[] imageFiles, String imageNamePrefix) throws Exception {
        List<String> photoUrls = new ArrayList<>();

        Cloudinary cloudinary = new Cloudinary(ObjectUtils.asMap(
                "cloud_name", CLOUDINARY_CLOUD_NAME,
                "api_key", CLOUDINARY_API_KEY,
                "api_secret", CLOUDINARY_API_SECRET));

        for (MultipartFile imageFile : imageFiles) {
            if (!imageFile.isEmpty()) {
                try {
                    byte[] imageBytes = imageFile.getBytes();

                    String imageName = imageNamePrefix + "_" + System.currentTimeMillis();
                    Map uploadResult = cloudinary.uploader().upload(imageBytes, ObjectUtils.asMap(
                            "public_id", imageName,
                            "folder", "product-images",
                            "overwrite", true));

                    String photoUrl = (String) uploadResult.get("secure_url");
                    photoUrls.add(photoUrl);
                } catch (IOException e) {
                    e.printStackTrace();
                    throw new Exception("Lỗi khi tải ảnh lên Cloudinary.");
                }
            }
        }

        return photoUrls;
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
