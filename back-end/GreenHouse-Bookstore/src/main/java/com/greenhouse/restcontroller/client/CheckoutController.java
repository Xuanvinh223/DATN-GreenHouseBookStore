package com.greenhouse.restcontroller.client;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Random;
import java.util.TimeZone;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.greenhouse.configuration.VNPayConfig;
import com.greenhouse.dto.client.CartVoucherDTO;
import com.greenhouse.dto.client.CheckoutDTO;
import com.greenhouse.model.Accounts;
import com.greenhouse.model.Carts;
import com.greenhouse.model.Invoices;
import com.greenhouse.model.Orders;
import com.greenhouse.repository.InvoicesRepository;
import com.greenhouse.repository.OrdersRepository;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/customer/rest/checkout")
public class CheckoutController {

    private CheckoutDTO checkoutData;
    // ----------------------------------------------------------------
    private Orders orders = new Orders();
    private List<Carts> listCarts = new ArrayList<>();
    private CartVoucherDTO cartVouchers = new CartVoucherDTO();

    // orders
    private final String fromName = "Green House Book Store";
    private final String fromPhone = "0869150620";
    private final String fromAddress = "Toà nhà FPT Polytechnic, Đ. Số 22, Thường Thạnh, Cái Răng, Cần Thơ, Vietnam";
    private final String fromWardName = "Phường Thường Thạnh";
    private final String fromDistrictName = "Quận Cái Răng";
    private final String fromProvinceName = "TP.Cần Thơ";
    private final String requiredNote = "KHONGCHOXEMHANG ";

    @Autowired
    private OrdersRepository ordersRepository;
    @Autowired
    private InvoicesRepository invoicesRepository;
    @Autowired
    private HttpServletRequest request;

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

    private Orders setDataOrders(CheckoutDTO data) {
        Orders orders = new Orders();

        String orderCode = generateOrderCode();
        orders.setOrderCode(orderCode);
        orders.setClientOrderCode(orderCode);
        orders.setUsername(data.getUsername());
        // Thông tin người gửi
        orders.setFromName(fromName);
        orders.setFromPhone(fromPhone);
        orders.setFromAddress(fromAddress);
        orders.setFromWardName(fromWardName);
        orders.setFromDistrictName(fromDistrictName);
        orders.setFromProvinceName(fromProvinceName);
        // Thông tin người nhận
        orders.setToPhone(data.getTo_phone());
        orders.setToAddress(data.getTo_address());
        orders.setToWardCode(data.getTo_ward_code());
        orders.setToDistrictId(data.getTo_district_id());

        // Thông tin dịch vụ GHN
        orders.setServiceId(data.getService_id());
        orders.setServiceTypeId(data.getService_type_id());
        orders.setRequiredNote(requiredNote);

        return orders;
    }

    private String generateOrderCode() {
        String dateFormat = "ddMMyyyy";
        SimpleDateFormat sdf = new SimpleDateFormat(dateFormat);

        String currentDate = sdf.format(new Date());

        int numberLength = 4;

        String randomNumber = generateRandomNumber(numberLength);

        String orderCode = "GH" + currentDate + randomNumber;
        do {
            orderCode = generateOrderCode();
        } while (ordersRepository.existsById(orderCode));
        return orderCode;
    }

    private String generateRandomNumber(int length) {
        StringBuilder sb = new StringBuilder();
        Random random = new Random();

        for (int i = 0; i < length; i++) {
            sb.append(random.nextInt(10));
        }

        return sb.toString();
    }

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
    @PostMapping("create-payment")
    public ResponseEntity<Map<String, Object>> createPayment(@RequestBody CheckoutDTO data) {
        Map<String, Object> response = new HashMap<String, Object>();
        // -----------------------------------------
        String username = data.getUsername();
        Date now = new Date();
        int quantity = data.getCarts().size();
        double totalAmount = data.getTotal_amount();
        double shippingFee = data.getShipping_fee();
        double paymentAmount = data.getPayment_total();
        
        // -----------------------------------------
        return ResponseEntity.ok(response);
    }
    // ==================================================================================================
    // @PostMapping("create-payment")
    // public ResponseEntity<Map<String, Object>> createPayment(@RequestBody
    // OrderDTO orderDTO) {
    // Map<String, Object> responseData = new HashMap<>();
    // String status = "";
    // String message = "";
    // String paymentUrl = "";

    // // Create bill
    // if (orderDTO.getPaymentMethod().equals("COD")) {
    // status = "COD";
    // message = "Đơn hàng của bạn sẽ được xử lý, cảm ơn bạn đã mua hàng!";
    // Bill bill = billService.createBillFromOrderDTO(orderDTO);
    // bill.setStatus(1);
    // billService.saveBillToDatabase(bill, orderDTO, orderIds);
    // billService.subtractQuantity(orderIds);
    // paymentUrl = "http://localhost:8081/client/checkout/donePay";
    // } else {
    // try {
    // Bill bill = billService.createBillFromOrderDTO(orderDTO);
    // billService.saveBillToDatabase(bill, orderDTO, orderIds);
    // paymentUrl = createVnPayPaymentUrl(bill);
    // } catch (UnsupportedEncodingException e) {
    // e.printStackTrace();
    // }
    // status = "VNPAY";
    // message = "Set value for url vnpay";
    // }
    // responseData.put("data", paymentUrl);
    // responseData.put("status", status);
    // responseData.put("message", message);
    // return ResponseEntity.ok(responseData);
    // }

    // private String createVnPayPaymentUrl(Bill bill)
    // throws UnsupportedEncodingException {
    // Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
    // SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");

    // String vnp_Version = "2.1.0";
    // String vnp_Command = "pay";
    // String vnp_TmnCode = VNPayConfig.vnp_TmnCode;
    // long vnp_Amount = 100 *
    // Optional.ofNullable(bill.getNewAmount()).orElse(bill.getAmount());
    // String vnp_CreateDate = formatter.format(cld.getTime());
    // String vnp_CurrCode = "VND";
    // String vnp_IpAddr = getCustomerIP();
    // String vnp_Local = "vn";
    // String vnp_ReturnUrl = VNPayConfig.vnp_ReturnUrl;
    // String vnp_TxnRef = String.format("%08d", bill.getId());
    // String vnp_OrderInfo = "Thanh toan don hang:" + vnp_TxnRef;
    // String vnp_OrderType = VNPayConfig.vnp_OrderType;
    // cld.add(Calendar.MINUTE, 15);
    // String vnp_ExpireDate = formatter.format(cld.getTime());

    // Map<String, String> vnp_Params = new HashMap<>();
    // vnp_Params.put("vnp_Version", vnp_Version);
    // vnp_Params.put("vnp_Command", vnp_Command);
    // vnp_Params.put("vnp_TmnCode", vnp_TmnCode);
    // vnp_Params.put("vnp_Amount", String.valueOf(vnp_Amount));
    // vnp_Params.put("vnp_CreateDate", vnp_CreateDate);
    // vnp_Params.put("vnp_CurrCode", vnp_CurrCode);
    // vnp_Params.put("vnp_IpAddr", vnp_IpAddr);
    // vnp_Params.put("vnp_Locale", vnp_Local);
    // vnp_Params.put("vnp_ReturnUrl", vnp_ReturnUrl);
    // vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
    // vnp_Params.put("vnp_OrderInfo", vnp_OrderInfo);
    // vnp_Params.put("vnp_OrderType", vnp_OrderType);
    // vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);

    // List<String> fieldNames = new ArrayList<>(vnp_Params.keySet());
    // Collections.sort(fieldNames);
    // StringBuilder hashData = new StringBuilder();
    // StringBuilder query = new StringBuilder();
    // Iterator itr = fieldNames.iterator();
    // while (itr.hasNext()) {
    // String fieldName = (String) itr.next();
    // String fieldValue = (String) vnp_Params.get(fieldName);
    // if ((fieldValue != null) && (fieldValue.length() > 0)) {
    // // Build hash data
    // hashData.append(fieldName);
    // hashData.append('=');
    // hashData.append(URLEncoder.encode(fieldValue,
    // StandardCharsets.US_ASCII.toString()));
    // // Build query
    // query.append(URLEncoder.encode(fieldName,
    // StandardCharsets.US_ASCII.toString()));
    // query.append('=');
    // query.append(URLEncoder.encode(fieldValue,
    // StandardCharsets.US_ASCII.toString()));
    // if (itr.hasNext()) {
    // query.append('&');
    // hashData.append('&');
    // }
    // }
    // }
    // String queryUrl = query.toString();
    // String vnp_SecureHash = VNPayConfig.hmacSHA512(VNPayConfig.vnp_HashSecret,
    // hashData.toString());
    // queryUrl += "&vnp_SecureHash=" + vnp_SecureHash;
    // return VNPayConfig.vnp_PayUrl + "?" + queryUrl;
    // }

    // @PostMapping("/vnpay-ipn")
    // public ResponseEntity<Map<String, String>> processVnpayIpn(@RequestBody
    // Map<String, String> vnpayData) {
    // Map<String, String> responseData = new HashMap<>();
    // try {

    // // Check if the vnp_TxnRef exists in your database (checkOrderId)
    // int billId = Integer.parseInt(vnpayData.get("vnp_TxnRef"));
    // Bill bill = billDAO.getBillById(billId);

    // boolean checkOrderId = true;
    // if (bill == null) {
    // checkOrderId = false;
    // }

    // // Check if the vnp_Amount is valid (Check vnp_Amount returned by VNPAY
    // compared
    // // to the amount in your database for the code vnp_TxnRef)
    // Long amountBill = bill.getNewAmount();
    // boolean checkAmount = true;
    // if (amountBill != Long.parseLong(vnpayData.get("vnp_Amount")) / 100) {
    // checkAmount = false;
    // }

    // // Check if the payment status is pending (PaymnentStatus = 0)
    // boolean checkOrderStatus = true;
    // if (bill.getStatus() != 0) {
    // checkOrderStatus = false;
    // }
    // if (checkOrderId) {
    // if (checkAmount) {
    // if (checkOrderStatus) {
    // if ("00".equals(vnpayData.get("vnp_ResponseCode"))) {
    // bill.setStatus(1);
    // billDAO.save(bill);
    // billService.subtractQuantity(orderIds);
    // responseData.put("RspCode", "00");
    // responseData.put("Message", "Xác nhận thành công");
    // orderIds = null;
    // } else {
    // bill.setStatus(2);
    // billDAO.save(bill);
    // String errorMessage = "";
    // switch (vnpayData.get("vnp_ResponseCode")) {
    // case "07":
    // errorMessage = "Giao dịch bị nghi ngờ, giao dịch bất thường.";
    // break;
    // case "09":
    // errorMessage = "Tài khoản của khách hàng chưa đăng ký dịch vụ
    // InternetBanking.";
    // break;
    // case "10":
    // errorMessage = "Khách hàng xác thực thông tin tài khoản không đúng quá 3
    // lần.";
    // break;
    // case "11":
    // errorMessage = "Đã hết hạn chờ thanh toán. Vui lòng thực hiện lại giao
    // dịch.";
    // break;
    // case "12":
    // errorMessage = "Tài khoản của khách hàng bị khóa.";
    // break;
    // case "13":
    // errorMessage = "Quý khách nhập sai mật khẩu xác thực giao dịch (OTP). Vui
    // lòng thực hiện lại giao dịch.";
    // break;
    // case "24":
    // errorMessage = "Khách hàng hủy giao dịch.";
    // break;
    // case "51":
    // errorMessage = "Tài khoản của quý khách không đủ số dư để thực hiện giao
    // dịch.";
    // break;
    // case "65":
    // errorMessage = "Tài khoản của Quý khách đã vượt quá hạn mức giao dịch trong
    // ngày.";
    // break;
    // case "75":
    // errorMessage = "Ngân hàng thanh toán đang bảo trì.";
    // break;
    // case "79":
    // errorMessage = "KH nhập sai mật khẩu thanh toán quá số lần quy định. Vui lòng
    // thực hiện lại giao dịch.";
    // break;
    // default:
    // errorMessage = "Có lỗi xảy ra trong quá trình xử lý giao dịch.";
    // }
    // responseData.put("RspCode", vnpayData.get("vnp_ResponseCode"));
    // responseData.put("Message", errorMessage);
    // }
    // } else {
    // responseData.put("RspCode", "02");
    // responseData.put("Message", "Đơn hàng đã được xác nhận trước đó");
    // }
    // } else {
    // responseData.put("RspCode", "04");
    // responseData.put("Message", "Số tiền không hợp lệ");
    // }
    // } else {
    // responseData.put("RspCode", "01");
    // responseData.put("Message", "Không tìm thấy đơn hàng");
    // }
    // responseData.put("invoiceId", String.format("%08d", bill.getId()));
    // } catch (Exception e) {
    // responseData.put("RspCode", "99");
    // responseData.put("Message", "Lỗi không xác định");
    // }
    // return ResponseEntity.ok(responseData);
    // }

    // private String getCustomerIP() {
    // String ipAddress = request.getRemoteAddr();
    // return ipAddress;
    // }

}
