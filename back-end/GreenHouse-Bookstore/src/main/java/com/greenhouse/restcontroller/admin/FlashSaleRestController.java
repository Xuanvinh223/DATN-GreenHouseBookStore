package com.greenhouse.restcontroller.AdminRestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
import com.greenhouse.service.FlashSalesService;
import com.greenhouse.service.ProductDetailService;
import com.greenhouse.service.ProductFlashSaleService;
import com.greenhouse.service.ProductsService;

@RestController
@CrossOrigin("*")
public class FlashSaleRestController {

    @Autowired
    FlashSalesService fs;

    @Autowired
    ProductFlashSaleService profs;

    @Autowired
    ProductDetailService detailService;

    @Autowired
    ProductsService productsService;

    @Autowired
    ProductDetailService productDetailService;

    @GetMapping("/rest/getData")
    public ResponseEntity<Map<String, Object>> getDataFlashSale() {
        Map<String, Object> resp = new HashMap<>();

        List<Flash_Sales> flashsalelist = fs.findAll();
        List<Product_Flash_Sale> productfsList = profs.findAll();
        List<Product_Detail> productDetailList = productDetailService.findAll();
        List<Products> productList = productsService.findAll();

        resp.put("flashsalelist", flashsalelist);
        resp.put("productfsList", productfsList);
        resp.put("productDetailList", productDetailList);
        resp.put("productList", productList);

        return ResponseEntity.ok(resp);

    }

    @GetMapping("/rest/edit/{id}")
    public ResponseEntity<Map<String, Object>> editFlashSale(@PathVariable Integer id) {
        Map<String, Object> resp = new HashMap<>();

        // Tìm Flash Sale cần chỉnh sửa
        Flash_Sales flashSaleToEdit = fs.findById(id);
        List<Product_Flash_Sale> productFS = profs.findByProductFSId(id);

        if (flashSaleToEdit != null) {
            resp.put("flashSale", flashSaleToEdit);
            resp.put("productFlashSale", productFS);
            return ResponseEntity.ok(resp);
        } else {
            return ResponseEntity.notFound().build();
        }
    }


    @PostMapping("/rest/flashsales")
    public ResponseEntity<String> createFlashSale(@RequestBody FlashSaleRequest request) {
        // Ở đây, FlashSaleRequest là một lớp Java chứa cả flashSale và
        // productFlashSales.
        Flash_Sales flashSale = request.getFlashSale();
        List<Product_Flash_Sale> product_Flash_Sale = request.getProductFlashSales();

        fs.add(flashSale);

        System.out.println(flashSale);

        for (Product_Flash_Sale p : product_Flash_Sale) {
            p.setFlashSaleId(flashSale);
            profs.add(p);
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
                fs.update(flashSale); // Cập nhật trạng thái trên máy chủ
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