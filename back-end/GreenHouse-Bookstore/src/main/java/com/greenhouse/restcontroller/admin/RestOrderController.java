package com.greenhouse.restcontroller.admin;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.greenhouse.model.Authorities;
import com.greenhouse.model.InvoiceDetails;
import com.greenhouse.model.InvoiceMappingVoucher;
import com.greenhouse.model.OrderDetails;
import com.greenhouse.model.Orders;
import com.greenhouse.model.Product_Detail;
import com.greenhouse.repository.AuthoritiesRepository;
import com.greenhouse.repository.InvoiceDetailsRepository;
import com.greenhouse.repository.InvoiceMappingVoucherRepository;
import com.greenhouse.repository.OrderDetailsRepository;
import com.greenhouse.repository.OrdersRepository;
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
    private AuthoritiesRepository authoritiesRepository;
    @Autowired
    private OrdersRepository ordersRepository;
    @Autowired
    private OrderDetailsRepository orderDetailsRepository;

    @GetMapping("/getData")
    private ResponseEntity<Map<String, Object>> getData() {
        Map<String, Object> responseData = new HashMap<>();

        List<Product_Detail> productDetails = productDetailRepository.findAll();
        List<Authorities> authorities = authoritiesRepository.findAll();
        List<Orders> listOrders = ordersRepository.findAll();
        responseData.put("listOrders", listOrders);
        responseData.put("productDetails", productDetails);
        responseData.put("authorities", authorities);

        return ResponseEntity.ok(responseData);
    }

    @GetMapping("/getOrderInfo/{orderCode}")
    private ResponseEntity<Map<String, Object>> getOrderInfo(@PathVariable String orderCode) {
        Map<String, Object> responseData = new HashMap<>();

        // Lấy thông tin đơn hàng
        Optional<Orders> order = ordersRepository.findById(orderCode);
        order.ifPresent(value -> responseData.put("order", value));

        // Lấy thông tin đơn hàng chi tiết
        List<OrderDetails> orderDetails = orderDetailsRepository.findByOrderCode(orderCode);
        responseData.put("orderDetails", orderDetails);

        return ResponseEntity.ok(responseData);
    }

}
