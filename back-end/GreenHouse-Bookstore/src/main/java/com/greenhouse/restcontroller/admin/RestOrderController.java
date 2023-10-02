package com.greenhouse.restcontroller.admin;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.greenhouse.model.Authorities;
import com.greenhouse.model.InvoiceDetails;
import com.greenhouse.model.InvoiceMappingVoucher;
import com.greenhouse.model.OrderMappingStatus;
import com.greenhouse.model.OrderStatus;
import com.greenhouse.model.Product_Detail;
import com.greenhouse.repository.AuthoritiesRepository;
import com.greenhouse.repository.InvoiceDetailsRepository;
import com.greenhouse.repository.InvoiceMappingVoucherRepository;
import com.greenhouse.repository.OrderMappingStatusRepository;
import com.greenhouse.repository.OrderStatusRepository;
import com.greenhouse.repository.ProductDetailRepository;

@RestController
@CrossOrigin("*")
@RequestMapping(value = "/rest/order")
public class RestOrderController {

    @Autowired
    private ProductDetailRepository productDetailRepository;
    @Autowired
    private InvoiceDetailsRepository invoiceDetailsRepository;
    @Autowired
    private InvoiceMappingVoucherRepository invoiceMappingVoucherRepository;
    @Autowired
    private OrderMappingStatusRepository orderMappingStatusRepository;
    @Autowired
    private OrderStatusRepository orderStatusRepository;
    @Autowired
    private AuthoritiesRepository authoritiesRepository;

    @GetMapping("/getData")
    private ResponseEntity<Map<String, Object>> getData() {
        Map<String, Object> responseData = new HashMap<>();

        List<InvoiceDetails> invoiceDetails = invoiceDetailsRepository.findAll();
        List<InvoiceMappingVoucher> invoiceMappingVoucher = invoiceMappingVoucherRepository.findAll();
        List<OrderMappingStatus> orderMappingStatus = orderMappingStatusRepository.findAll();
        List<OrderStatus> orderStatus = orderStatusRepository.findAll();
        List<Product_Detail> productDetails = productDetailRepository.findAll();
        List<Authorities> authorities = authoritiesRepository.findAll();

        responseData.put("invoiceDetails", invoiceDetails);
        responseData.put("invoiceMappingVoucher", invoiceMappingVoucher);
        responseData.put("orderMappingStatus", orderMappingStatus);
        responseData.put("orderStatus", orderStatus);
        responseData.put("productDetails", productDetails);
        responseData.put("authorities", authorities);

        return ResponseEntity.ok(responseData);
    }

}
