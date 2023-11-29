package com.greenhouse.restcontroller.client;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.greenhouse.model.OrderDetails;
import com.greenhouse.model.Orders;
import com.greenhouse.repository.AccountRepository;
import com.greenhouse.repository.OrderDetailsRepository;
import com.greenhouse.repository.OrdersRepository;
import com.greenhouse.repository.ProductDetailRepository;
import com.greenhouse.repository.ProductsRepository;
import com.greenhouse.service.EmailService;

import jakarta.transaction.Transactional;

@RestController
@RequestMapping("/customer/rest/order")
public class OrderController {
    @Autowired
    OrderDetailsRepository od;
    @Autowired
    OrdersRepository o;
    @Autowired
    AccountRepository a;
    @Autowired
    ProductsRepository p;
    @Autowired
    ProductDetailRepository pd;
    @Autowired
    EmailService sendEmail;

    @GetMapping("/{username}")
    public Map<String, Object> getOrders(@PathVariable String username) {
        Map<String, Object> response = new HashMap<>();
        List<Orders> orders = o.findByUsername(username);
        response.put("orders", orders);
        return response;
    }

    @Transactional
    @GetMapping("/orderdetail/{orderCode}")
    public List<OrderDetails> getOrderDetail(@PathVariable String orderCode) {
        return od.findByOrderCode(orderCode);
    }

    @PutMapping("/cancelOrder/{orderCode}")
    public ResponseEntity<String> cancelOrder(@PathVariable String orderCode, @RequestBody Orders updatedOrder) {
        Optional<Orders> optionalOrder = o.findById(orderCode);

        if (optionalOrder.isPresent()) {
            Orders existingOrder = optionalOrder.get();
            // Update order status, confirmed_By, and save cancellation reason (note)
            existingOrder.setStatus(updatedOrder.getStatus());
            existingOrder.setNote(updatedOrder.getNote());
            o.save(existingOrder);
            return ResponseEntity.ok("Đã hủy đơn hàng");
        } else {
            return ResponseEntity.badRequest().body("Không thể hủy đơn hàng với trạng thái hiện tại");
        }
    } 

}
