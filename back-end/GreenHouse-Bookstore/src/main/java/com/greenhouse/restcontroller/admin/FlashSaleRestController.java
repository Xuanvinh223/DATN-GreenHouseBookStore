package com.greenhouse.restcontroller.admin;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.greenhouse.dto.FlashSaleRequest;
import com.greenhouse.model.Flash_Sales;
import com.greenhouse.model.Product_Detail;
import com.greenhouse.model.Product_Flash_Sale;
import com.greenhouse.model.Products;
import com.greenhouse.repository.FlashSalesRepository;
import com.greenhouse.repository.ProductDetailRepository;
import com.greenhouse.repository.Product_FlashSaleRepository;
import com.greenhouse.repository.ProductsRepository;
import com.greenhouse.service.ProductsService;

import jakarta.transaction.Transactional;

@RestController
@CrossOrigin("*")
public class FlashSaleRestController {

    @Autowired
    FlashSalesRepository fs;

    @Autowired
    Product_FlashSaleRepository profs;

    @Autowired
    ProductDetailRepository detailService;

    @Autowired
    ProductsRepository productsRepo;

    @Autowired
    ProductDetailRepository productDetailService;

    @GetMapping("/rest/getData")
    public ResponseEntity<Map<String, Object>> getDataFlashSale() {
        Map<String, Object> resp = new HashMap<>();

        List<Flash_Sales> flashsalelist = fs.findAll();
        List<Product_Flash_Sale> productfsList = profs.findAll();
        List<Product_Detail> productDetailList = productDetailService.findAll();
        List<Products> productList = productsRepo.findAll();

        resp.put("flashsalelist", flashsalelist);
        resp.put("productfsList", productfsList);
        resp.put("productDetailList", productDetailList);
        resp.put("productList", productList);

        return ResponseEntity.ok(resp);

    }

    @Transactional
    @GetMapping("/rest/edit/{id}")
    public ResponseEntity<Map<String, Object>> editFlashSale(@PathVariable Integer id) {
        Map<String, Object> resp = new HashMap<>();

        // Lấy Flash Sale theo ID
        Optional<Flash_Sales> flashSaleOptional = fs.findById(id);
        if (flashSaleOptional.isPresent()) {
            Flash_Sales flashSale = flashSaleOptional.get();

            // Lấy danh sách sản phẩm chi tiết liên quan đến Flash Sale
            List<Product_Flash_Sale> productFS = profs.findByFlashSaleId(flashSale);

            resp.put("listProductFlashSale", productFS);
            resp.put("flashSale", flashSale);
            return ResponseEntity.ok(resp);
        } else {
            // Nếu không tìm thấy Flash Sale theo ID, trả về phản hồi rỗng hoặc thông báo lỗi
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/rest/flashsales")
    public ResponseEntity<String> createFlashSale(@RequestBody FlashSaleRequest request) {
        // Ở đây, FlashSaleRequest là một lớp Java chứa cả flashSale và
        // productFlashSales.
        Flash_Sales flashSale = request.getFlashSale();
        List<Product_Flash_Sale> product_Flash_Sale = request.getProductFlashSales();
        List<Product_Flash_Sale> listDeletedProductFlashSale = request.getListDeletedProductFlashSale();

        if (!listDeletedProductFlashSale.isEmpty()) {
            for (Product_Flash_Sale item : listDeletedProductFlashSale) {
                profs.delete(item);
            }
        }
        
        fs.save(flashSale);

        for (Product_Flash_Sale p : product_Flash_Sale) {
            p.setFlashSaleId(flashSale);
            profs.save(p);
        }
        // Trả về FlashSale đã được tạo.
        return ResponseEntity.ok(null);
    }

    @PutMapping("/rest/updateFlashSaleStatus")
    public ResponseEntity<String> updateFlashSaleStatus() {
        try {
            // Lấy danh sách tất cả Flash Sales từ dịch vụ (service)
            List<Flash_Sales> flashSalesList = fs.findAll();
            // Lặp qua danh sách Flash Sales và kiểm tra cập nhật trạng thái
            for (Flash_Sales flashSale : flashSalesList) {
                flashSale.setStatus(3);
                fs.save(flashSale); // Cập nhật trạng thái trên máy chủ
            } // Gọi hàm cập nhật từ service
              // Trả về phản hồi thành công nếu không có lỗi
            return ResponseEntity.ok("Cập nhật trạng thái Flash Sale thành công");
        } catch (Exception e) {
            // Xử lý lỗi và trả về phản hồi lỗi
            e.printStackTrace(); // In lỗi ra console để gỡ rối (có thể loại bỏ ở production)
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Có lỗi xảy ra khi cập nhật trạng thái Flash Sale");
        }
    }

    // FORM FLASH SALE REST API

}

// @GetMapping("/rest/flashsales")
// public ResponseEntity<List<Flash_Sales>> getAll() {
// return ResponseEntity.ok(fs.findAll());
// }
// @GetMapping("/rest/flashsales")
// public ResponseEntity<List<Flash_Sales>> getAll() {
// return ResponseEntity.ok(fs.findAll());

// }
// @GetMapping("/rest/flashsales")
// public ResponseEntity<List<Flash_Sales>> getAll() {
// return ResponseEntity.ok(fs.findAll());

// }

// @GetMapping("/rest/productflashsales/{Flash_Sale_Id}")
// public ResponseEntity<?>
// getProductFlashSaleByIDFS(@PathVariable("Flash_Sale_Id") Integer id) {
// if (profs.findByProductFSId(id) == null) {
// return ResponseEntity.notFound().build();
// }
// return ResponseEntity.ok(profs.findByProductFSId(id));
// }

// @GetMapping("/rest/flashsales/{id}")
// public ResponseEntity<Flash_Sales> getOne(@PathVariable("id") Integer id) {
// if (fs.findById(id) == null) {
// return ResponseEntity.notFound().build();
// }
// return ResponseEntity.ok(fs.findById(id));
// }

// @PostMapping("/rest/flashsales")
// public ResponseEntity<String> createFlashSale(@RequestBody FlashSaleRequest
// request) {
// // Ở đây, FlashSaleRequest là một lớp Java chứa cả flashSale và
// // productFlashSales.
// Flash_Sales flashSale = request.getFlashSale();
// List<Product_Flash_Sale> product_Flash_Sale = request.getProductFlashSales();

// fs.add(flashSale);

// System.out.println(flashSale);

// for (Product_Flash_Sale p : product_Flash_Sale) {
// p.setFlashSaleId(flashSale);
// profs.add(p);
// }
// // Trả về FlashSale đã được tạo.
// return ResponseEntity.ok(null);
// }

// @GetMapping("/rest/productfs")
// public ResponseEntity<List<Product_Detail>> getProductsByStatus() {
// List<Product_Detail> lProducts = productDetailService.findAll();
// List<Product_Detail> respon = new ArrayList<>();

// for (Product_Detail p : lProducts) {
// if (p.getProduct().isStatus()) {
// respon.add(p);
// }
// }
// return ResponseEntity.ok(respon);
// }