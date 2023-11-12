package com.greenhouse.restcontroller.client;

import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.greenhouse.model.Authentic_Photos;
import com.greenhouse.model.Product_Detail;
import com.greenhouse.model.Product_Discount;
import com.greenhouse.model.Product_Images;
import com.greenhouse.model.Product_Reviews;
import com.greenhouse.repository.AuthenticPhotosRepository;
import com.greenhouse.repository.BookAuthorsRepository;
import com.greenhouse.repository.BrandRepository;
import com.greenhouse.repository.ProductDetailRepository;
import com.greenhouse.repository.ProductDiscountRepository;
import com.greenhouse.repository.ProductReviewsRepository;
import com.greenhouse.repository.Product_ImagesRepository;
import com.greenhouse.repository.ProductsRepository;

import io.jsonwebtoken.io.IOException;
import jakarta.transaction.Transactional;

@RestController
@RequestMapping("/customer/rest/product-detail")
public class ProductDetailController {

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
    @Autowired
    private Product_ImagesRepository productImagesReps;
    @Autowired
    private AuthenticPhotosRepository authenticPhotosRepository;

    private static final String CLOUDINARY_CLOUD_NAME = "dmbh3sz8s";
    private static final String CLOUDINARY_API_KEY = "165312227781173";
    private static final String CLOUDINARY_API_SECRET = "xcADjr7hxF6iXNMtsdf2CQAnbOI";

    @Transactional
    @GetMapping("/{productDetailId}")
    public Map<String, Object> getProductsDetail(@PathVariable Integer productDetailId) {
        Map<String, Object> response = new HashMap<>();

        Optional<Product_Detail> productDetailOptional = productDetailReps.findById(productDetailId);

        if (productDetailOptional.isPresent()) {
            Product_Detail productDetail = productDetailOptional.get();

            // Sử dụng phương thức truy vấn tùy chỉnh để lấy danh sách hình ảnh
            List<Product_Images> productImages = productImagesReps.findByProductDetail_ProductDetailId(productDetailId);
            List<Product_Detail> relatedProducts = productDetailReps.findRelatedProducts(productDetailId);
            List<Product_Reviews> productReviews = productReviewsRepository
                    .findByProductDetail_ProductDetailId(productDetailId);

            List<Product_Discount> productDiscounts = productDiscountRepository
                    .findProductDiscountsByProductDetailIdAndDate(productDetailId);
            List<Product_Discount> listProductDiscounts = productDiscountRepository.findAll();
            List<Product_Reviews> listProductReviews = productReviewsRepository.findAll();

            // Tạo một map chứa thông tin
            Map<String, Object> productInfo = new HashMap<>();
            productInfo.put("productDetail", productDetail);
            productInfo.put("productImages", productImages);
            productInfo.put("relatedProducts", relatedProducts);
            productInfo.put("listProductReviews", listProductReviews);
            productInfo.put("productReviews", productReviews);

            productInfo.put("productDiscounts", productDiscounts);
            productInfo.put("listProductDiscounts", listProductDiscounts);

            response.put("data", productInfo);
        } else {
            response.put("error", "Sản phẩm không tồn tại.");
        }

        return response;
    }

    @Transactional
    @GetMapping("/reviews/{reviewId}")
    public List<Authentic_Photos> getAuthenticPhotosForReview(@PathVariable Integer reviewId) {
        return authenticPhotosRepository.findByProductReview_ReviewId(reviewId);
    }

    @PostMapping("/reviews")
    public ResponseEntity<Product_Reviews> createAddress(@RequestBody Product_Reviews product_Reviews) {
        Product_Reviews productReview = productReviewsRepository.save(product_Reviews);
        return new ResponseEntity<>(productReview, HttpStatus.CREATED);
    }

    @PostMapping("/reviews/{reviewId}/images")
    public ResponseEntity<List<Authentic_Photos>> saveReviewImagesAndInfo(
            @PathVariable Integer reviewId,
            @RequestParam("file") MultipartFile[] files) {
        Product_Reviews productReview = productReviewsRepository.findById(reviewId).orElse(null);
        List<Authentic_Photos> savedImages = new ArrayList<>();

        if (productReview != null) {
            try {
                // Tải lên nhiều tệp hình ảnh lên Cloudinary
                List<String> cloudinaryUrls = uploadImagesToCloudinary(files,
                        "authenticPhoto_" + System.currentTimeMillis());

                for (String cloudinaryUrl : cloudinaryUrls) {
                    // Tạo đối tượng Authentic_Photos và lưu thông tin
                    Authentic_Photos authenticPhoto = new Authentic_Photos();
                    authenticPhoto.setPhotoName(cloudinaryUrl); // Lưu URL thật của ảnh
                    authenticPhoto.setProductReviewId(reviewId);

                    // Lưu đối tượng Authentic_Photos vào cơ sở dữ liệu
                    authenticPhotosRepository.save(authenticPhoto);

                    savedImages.add(authenticPhoto);
                }

                return ResponseEntity.ok(savedImages);
            } catch (Exception e) {
                e.printStackTrace();
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
            }
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @DeleteMapping("/reviews/{reviewId}")
    public ResponseEntity<String> deleteReview(@PathVariable Integer reviewId) {
        // Lấy danh sách hình ảnh của đánh giá dựa trên reviewId
        List<Authentic_Photos> authenticPhotos = authenticPhotosRepository.findByProductReview_ReviewId(reviewId);
        // Xóa hình ảnh của đánh giá từ cơ sở dữ liệu
        authenticPhotosRepository.deleteAll(authenticPhotos);
        // Xóa đánh giá từ cơ sở dữ liệu
        productReviewsRepository.deleteById(reviewId);
        return ResponseEntity.ok("Xóa đánh giá và hình ảnh thành công.");
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
                            "folder", "accounts",
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

}
