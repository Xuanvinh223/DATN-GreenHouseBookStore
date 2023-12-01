package com.greenhouse.restcontroller.client;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.greenhouse.dto.client.CheckoutCompleteDTO;
import com.greenhouse.dto.client.CheckoutDTO;
import com.greenhouse.model.InvoiceDetails;
import com.greenhouse.model.InvoiceMappingVoucher;
import com.greenhouse.model.Invoices;
import com.greenhouse.model.OrderDetails;
import com.greenhouse.model.Orders;
import com.greenhouse.repository.InvoiceDetailsRepository;
import com.greenhouse.repository.InvoiceMappingVoucherRepository;
import com.greenhouse.repository.InvoicesRepository;
import com.greenhouse.repository.OrderDetailsRepository;
import com.greenhouse.repository.OrdersRepository;
import com.greenhouse.service.CheckoutService;
import com.greenhouse.service.VNPayService;

import jakarta.servlet.http.HttpServletResponse;

@RestController
@CrossOrigin("*")
@RequestMapping("/customer/rest/checkout")
public class CheckoutController {

    private CheckoutDTO checkoutData;
    private CheckoutCompleteDTO checkoutCompleteData;

    @Autowired
    private CheckoutService checkoutService;
    @Autowired
    private InvoiceDetailsRepository invoiceDetailsRepository;
    @Autowired
    private OrderDetailsRepository orderDetailsRepository;
    @Autowired
    private InvoiceMappingVoucherRepository invoiceMappingVoucherRepository;
    @Autowired
    private VNPayService vnPayService;
    @Autowired
    private InvoicesRepository invoicesRepository;
    @Autowired
    private OrdersRepository ordersRepository;

    @GetMapping("/getData")
    public ResponseEntity<Map<String, Object>> getData() {
        Map<String, Object> response = new HashMap<String, Object>();
        String status = "";
        String message = "";
        // -----------------------------------------
        try {
            response.put("checkoutData", checkoutData);
        } catch (Exception e) {
            System.out.println(e);
            status = "error";
            message = "Lỗi get data checkout";
        }
        // -----------------------------------------
        status = "success";
        message = "Get data checkout thành công";
        response.put("status", status);
        response.put("message", message);
        return ResponseEntity.ok(response);
    }

    // ==================================================================================================
    @PostMapping("/setData")
    public ResponseEntity<Map<String, Object>> setData(@RequestBody CheckoutDTO data) {
        Map<String, Object> response = new HashMap<String, Object>();
        String status = "";
        String message = "";
        // -----------------------------------------
        checkoutData = data;
        try {
            response.put("checkoutData", checkoutData);
        } catch (Exception e) {
            System.out.println(e);
            status = "error";
            message = "Lỗi set data checkout";
        }
        // -----------------------------------------
        status = "success";
        message = "Set data checkout thành công";
        response.put("status", status);
        response.put("message", message);
        return ResponseEntity.ok(response);
    }

    // ==================================================================================================
    @PostMapping("/create-payment")
    public ResponseEntity<Map<String, Object>> createPayment(@RequestBody CheckoutDTO data) {
        Map<String, Object> response = new HashMap<String, Object>();
        String status = "success";
        String message = "Create payment success";
        try {
            boolean appliedVoucher = false;
            boolean validVoucher = false;
            if (data.getVoucher() != null) {
                appliedVoucher = true;
                if (checkoutService.validVoucher(data.getVoucher())) {
                    validVoucher = true;
                }
            }
            if (appliedVoucher && !validVoucher) {
                status = "error-voucher";
                message = "Voucher đã hết!";
                response.put("status", status);
                response.put("message", message);
                return ResponseEntity.ok(response);
            }
            // Create order
            Orders order = checkoutService.createOrder(data);

            // Create order status history
            checkoutService.createOrderStatusHistory(order.getOrderCode(), "pending_confirmation");

            // Create invoice
            Invoices invoices = checkoutService.createInvoice(data, order);

            // Create invoice status mapping with id = 2
            checkoutService.createInvoiceStatusMapping(invoices, 2); // id:2 = chưa thanh toán

            // Create invoice details and order details
            checkoutService.createInvoiceDetailsAndOrderDetails(data.getCarts(), invoices, order);

            // Subtract product quantity
            checkoutService.subtractProductQuantity(data.getCarts());

            // Update cart status
            checkoutService.updateCartStatus(data.getCarts());

            // Create invoice mapping voucher
            checkoutService.createInvoiceMappingVoucher(data, invoices,
                    data.getUsername());

            response.put("invoices", invoices);
            response.put("order", order);
            response.put("payment_method", data.getPayment_method());
            // Create url for payment
            if (data.getPayment_method().equalsIgnoreCase("cod")) {
                CheckoutCompleteDTO temp = new CheckoutCompleteDTO();
                temp.setInvoices(invoices);
                temp.setOrders(order);
                checkoutCompleteData = temp;
                response.put("url", "http://localhost:8081/checkout-complete");
            } else if (data.getPayment_method().equalsIgnoreCase("vnpay")) {
                Map<String, Object> vnpayData = vnPayService.createVNPayUrl(invoices, order);
                String vnPayUrl = vnpayData.get("data").toString();
                response.put("url", vnPayUrl);
            }
            // ----------------------------------------------------------------
        } catch (Exception e) {
            status = "error";
            message = "lỗi api thanh toánn";
            throw new RuntimeException("Error processing payment", e);
        }
        response.put("status", status);
        response.put("message", message);
        return ResponseEntity.ok(response);
    }

    // ==================================================================================================
    @PostMapping("/payment-callback")
    public void paymentCallback(@RequestBody Map<String, String> request, HttpServletResponse response) {
        try {
            // Begin process return from VNPAY
            String invoiceId = request.get("vnp_OrderInfo");
            String orderCode = request.get("vnp_TxnRef");
            Invoices invoices = invoicesRepository.findById(Integer.parseInt(invoiceId)).orElse(null);
            Orders orders = ordersRepository.findById(orderCode).orElse(null);
            String bankCode = request.get("vnp_BankCode");
            if (bankCode != null && !bankCode.equals("")) {
                invoices.setBankCode(bankCode);
                invoicesRepository.save(invoices);
            }
            if ("00".equals(request.get("vnp_ResponseCode"))) {
                // Update status of invoice
                checkoutService.createInvoiceStatusMapping(invoices, 1);
                CheckoutCompleteDTO checkoutCompleteDTO = new CheckoutCompleteDTO();
                checkoutCompleteDTO.setInvoices(invoices);
                checkoutCompleteDTO.setOrders(orders);
                checkoutCompleteData = checkoutCompleteDTO;
            } else {
                // Update status of invoice
                checkoutService.createInvoiceStatusMapping(invoices, 3);
            }
            System.out.println("{\"RspCode\":\"00\",\"Message\":\"Confirm Success\"}");

        } catch (Exception e) {
            System.out.println("{\"RspCode\":\"99\",\"Message\":\"Unknow error\"}");
        }
    }

    // ==================================================================================================

    @GetMapping("/getCheckoutCompleteData")
    public ResponseEntity<Map<String, Object>> getCheckoutCompleteData() {
        Map<String, Object> response = new HashMap<String, Object>();
        String status = "";
        String message = "";
        // ----------------------------------------------------------------
        if (checkoutCompleteData != null) {
            Invoices invoices = checkoutCompleteData.getInvoices();
            Orders orders = checkoutCompleteData.getOrders();
            List<InvoiceDetails> invoiceDetails = invoiceDetailsRepository
                    .findByInvoice(invoices);
            List<OrderDetails> orderDetails = orderDetailsRepository
                    .findByOrderCode(orders.getOrderCode());
            List<InvoiceMappingVoucher> imv = invoiceMappingVoucherRepository
                    .findByInvoice(invoices);
            // -----------------------------------------
            response.put("invoice", invoices);
            response.put("order", orders);
            response.put("orderDetails", orderDetails);
            response.put("invoiceDetails", invoiceDetails);
            response.put("invoiceMV", imv);
            // -----------------------------------------
            // Create invoice status mapping with id = 1
            checkoutService.createInvoiceStatusMapping(invoices, 1); // id:1 = đã thanh toán
        }
        // -----------------------------------------
        status = "success";
        message = "Get data checkout-complete thành công";
        response.put("status", status);
        response.put("message", message);
        // ----------------------------------------------------------------
        return ResponseEntity.ok(response);
    }
    // ==================================================================================================
}
