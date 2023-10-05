package com.greenhouse.restcontroller.admin;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.greenhouse.dto.ImportInvoiceDTO;
import com.greenhouse.dto.Response;
import com.greenhouse.model.*;
import com.greenhouse.repository.*;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@CrossOrigin("*")
public class InventoryRestController {

    @Autowired
    ProductDetailRepository productDetailRepository;

    @Autowired
    SuppliersRepository suppliersRepository;

    @Autowired
    ImportInvoiceRepository impInvoice_Repository;

    @Autowired
    ImportInvoice_DetailRepository impInvoiceDetailRepository;

    @GetMapping("/rest/getInventory")
    public ResponseEntity<Map<String, Object>> getInventory() {
        Map<String, Object> resp = new HashMap<>();
        List<Import_Invoice> importInvoice = impInvoice_Repository.findAll();
        List<Import_Invoice_Detail> importInvoiceDetails = impInvoiceDetailRepository.findAll();
        List<Product_Detail> productDetails = productDetailRepository.findAll();
        List<Suppliers> suppliers = suppliersRepository.findAll();

        resp.put("importInvoice", importInvoice);
        resp.put("importInvoiceDetails", importInvoiceDetails);
        resp.put("listProductDetails", productDetails);
        resp.put("suppliers", suppliers);
        return ResponseEntity.ok(resp);
    }

    @PostMapping("/rest/importInvoice")
    public ResponseEntity<String> postMethodName(@RequestBody ImportInvoiceDTO request) {
        Import_Invoice importInvoice = request.getImportInvoice();
        List<Import_Invoice_Detail> listImportInvoiceDetails = request.getImportInvoiceDetails();

        impInvoice_Repository.save(importInvoice);

        for (Import_Invoice_Detail importInvoiceDetail : listImportInvoiceDetails) {
            importInvoiceDetail.setImportInvoice(importInvoice);
            impInvoiceDetailRepository.save(importInvoiceDetail);

            // Lặp qua danh sách productDetailIds và cập nhật số lượng tồn kho cho từng sản
            // phẩm
            // Lấy thông tin Product_Detail từ importInvoiceDetail
            Product_Detail productDetail = importInvoiceDetail.getProductDetail();

            // Cập nhật số lượng tồn kho của Product_Detail
            int currentQuantityInStock = productDetail.getQuantityInStock();
            int quantityToAdd = importInvoiceDetail.getQuantity();
            int newQuantityInStock = currentQuantityInStock + quantityToAdd;
            productDetail.setQuantityInStock(newQuantityInStock);

            // Lưu lại thông tin Product_Detail sau khi cập nhật
            productDetailRepository.save(productDetail);
        }

        return ResponseEntity.ok(null);
    }

}
