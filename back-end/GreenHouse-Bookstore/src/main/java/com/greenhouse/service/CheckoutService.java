package com.greenhouse.service;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.number.NumberStyleFormatter;
import org.springframework.stereotype.Service;
import com.greenhouse.dto.client.CartVoucherDTO;
import com.greenhouse.dto.client.CheckoutDTO;
import com.greenhouse.model.Accounts;
import com.greenhouse.model.Carts;
import com.greenhouse.model.Discounts;
import com.greenhouse.model.InvoiceDetails;
import com.greenhouse.model.InvoiceMappingStatus;
import com.greenhouse.model.InvoiceMappingVoucher;
import com.greenhouse.model.Invoices;
import com.greenhouse.model.OrderDetails;
import com.greenhouse.model.OrderInfo;
import com.greenhouse.model.Order_Status_History;
import com.greenhouse.model.Orders;
import com.greenhouse.model.Product_Detail;
import com.greenhouse.model.Product_Discount;
import com.greenhouse.model.Products;
import com.greenhouse.model.UserVoucher;
import com.greenhouse.model.VoucherMappingCategory;
import com.greenhouse.model.VoucherMappingProduct;
import com.greenhouse.model.Vouchers;
import com.greenhouse.repository.AccountRepository;
import com.greenhouse.repository.CartsRepository;
import com.greenhouse.repository.DiscountsRepository;
import com.greenhouse.repository.InvoiceDetailsRepository;
import com.greenhouse.repository.InvoiceMappingStatusRepository;
import com.greenhouse.repository.InvoiceMappingVoucherRepository;
import com.greenhouse.repository.InvoicesRepository;
import com.greenhouse.repository.OrderDetailsRepository;
import com.greenhouse.repository.OrderStatusHistoryRepository;
import com.greenhouse.repository.OrdersRepository;
import com.greenhouse.repository.PaymentStatusRepository;
import com.greenhouse.repository.ProductDetailRepository;
import com.greenhouse.repository.ProductDiscountRepository;
import com.greenhouse.repository.UserVoucherRepository;
import com.greenhouse.repository.VoucherMappingCategoryRepository;
import com.greenhouse.repository.VoucherMappingProductRepository;

@Service
public class CheckoutService {

    @Autowired
    private OrdersRepository ordersRepository;
    @Autowired
    private OrderStatusHistoryRepository orderStatusHistoryRepository;
    @Autowired
    private OrderDetailsRepository orderDetailsRepository;
    @Autowired
    private InvoicesRepository invoicesRepository;
    @Autowired
    private AccountRepository accountRepository;
    @Autowired
    private InvoiceMappingStatusRepository invoiceMappingStatusRepository;
    @Autowired
    private InvoiceMappingVoucherRepository invoiceMappingVoucherRepository;
    @Autowired
    private PaymentStatusRepository paymentStatusRepository;
    @Autowired
    private InvoiceDetailsRepository invoiceDetailsRepository;
    @Autowired
    private ProductDetailRepository productDetailsRepository;
    @Autowired
    private VoucherMappingCategoryRepository voucherMappingCategoryRepository;
    @Autowired
    private VoucherMappingProductRepository voucherMappingProductRepository;
    @Autowired
    private UserVoucherRepository userVoucherRepository;
    @Autowired
    private CartsRepository cartsRepository;
    @Autowired
    private ProductDiscountRepository productDiscountRepository;
    @Autowired
    private DiscountsRepository discountsRepository;

    // ================================================================================================
    public Invoices createInvoice(CheckoutDTO data, Orders order) {
        Accounts username = accountRepository.findById(data.getUsername()).orElse(null);
        Invoices invoices = new Invoices();
        invoices.setAccount(username);
        invoices.setCreateDate(new Date());
        invoices.setQuantity(data.getCarts().size());
        invoices.setTotalAmount(data.getTotal_amount());
        invoices.setShippingFee(data.getShipping_fee());
        invoices.setPaymentAmount(data.getPayment_total());
        invoices.setPaymentMethod(data.getPayment_method());
        invoicesRepository.save(invoices);
        return invoices;
    }

    public void createInvoiceStatusMapping(Invoices invoices, int status) {
        InvoiceMappingStatus iMappingStatus = new InvoiceMappingStatus();
        iMappingStatus.setInvoice(invoices);
        iMappingStatus.setPaymentStatus(paymentStatusRepository.findById(status).orElse(null)); 
        iMappingStatus.setUpdateAt(new Date());
        invoiceMappingStatusRepository.save(iMappingStatus);
    }

    public void createInvoiceDetailsAndOrderDetails(List<Carts> listCarts, Invoices invoices, Orders order) {
        for (Carts item : listCarts) {
            InvoiceDetails invoiceDetails = new InvoiceDetails();
            invoiceDetails.setInvoice(invoices);
            invoiceDetails.setProductDetail(item.getProductDetail());
            invoiceDetails.setQuantity(item.getQuantity());
            invoiceDetails.setPrice(item.getPrice());
            invoiceDetails.setPriceDiscount(item.getPriceDiscount());
            invoiceDetails.setAmount(item.getAmount());
            invoiceDetailsRepository.save(invoiceDetails);

            OrderDetails orderDetails = new OrderDetails();
            orderDetails.setOrderCode(order.getOrderCode());
            orderDetails.setProductDetailId(item.getProductDetail().getProductDetailId());
            orderDetails.setProductName(item.getProductDetail().getProduct().getProductName());
            orderDetails.setPrice(item.getPriceDiscount());
            orderDetails.setQuantity(item.getQuantity());
            orderDetails.setWeight(item.getProductDetail().getWeight() * item.getQuantity());
            orderDetails.setWidth(item.getProductDetail().getWidth());
            orderDetails.setLength(item.getProductDetail().getLength());
            orderDetails.setHeight(item.getProductDetail().getHeight());
            orderDetailsRepository.save(orderDetails);
        }
    }

    // ================================================================================================
    public Orders createOrder(CheckoutDTO data) {
        Orders order = setDataOrders(data);
        ordersRepository.save(order);
        return order;
    }

    public void createOrderStatusHistory(String orderCode) {
        Order_Status_History orderStatusHistory = new Order_Status_History();
        orderStatusHistory.setOrderCode(orderCode);
        orderStatusHistory.setUpdateAt(new Date());
        orderStatusHistory.setStatus("pending");
        orderStatusHistoryRepository.save(orderStatusHistory);
    }

    // ================================================================================================
    public void subtractProductQuantity(List<Carts> listCarts) {
        for (Carts item : listCarts) {
            Product_Detail pDetail = item.getProductDetail();
            pDetail.setQuantityInStock(pDetail.getQuantityInStock() - item.getQuantity());
            productDetailsRepository.save(pDetail);
        }
    }

    public void increaseDiscountProductQuantity(List<Carts> listCarts) {                    
        for (Carts item : listCarts) {
            Product_Discount pDiscount = productDiscountRepository.findByProductDetail(item.getProductDetail());
            Discounts discount = pDiscount.getDiscount();
            discount.setUsedQuantity(discount.getUsedQuantity() + item.getQuantity());
            discountsRepository.save(discount);
        }
    }

    public void updateCartStatus(List<Carts> listCarts) {
        for (Carts item : listCarts) {
            item.setStatus(false);
            cartsRepository.save(item);
        }
    }

    // ================================================================================================
    public void createInvoiceMappingVoucher(CheckoutDTO data, Invoices invoices, String username) {
        CartVoucherDTO voucherDTO = data.getVoucher();
        if (voucherDTO != null) {
            if (voucherDTO.getNormalVoucherApplied() != null) {
                Vouchers vouchers = voucherDTO.getNormalVoucherApplied();
                Double discount = data.getNormal_discount();
                InvoiceMappingVoucher iMappingVoucher = new InvoiceMappingVoucher();
                iMappingVoucher.setInvoice(invoices);
                iMappingVoucher.setVoucher(vouchers);
                iMappingVoucher.setDiscountAmount(discount);
                invoiceMappingVoucherRepository.save(iMappingVoucher);

                UserVoucher userVoucher = userVoucherRepository.findByUsernameAndVoucherAndStatus(username, vouchers,
                        true);
                userVoucher.setStatus(false);
                vouchers.setUsedQuantity(vouchers.getUsedQuantity() + 1);

                if (vouchers.getTotalQuantity() - vouchers.getUsedQuantity() <= 0) {
                    vouchers.setStatus(false);
                    List<VoucherMappingCategory> listVMC = voucherMappingCategoryRepository
                            .findByVoucherId(vouchers.getVoucherId());
                    if (listVMC.size() > 0) {
                        for (VoucherMappingCategory item : listVMC) {
                            item.setStatus(false);
                            voucherMappingCategoryRepository.save(item);
                        }
                    }
                    List<VoucherMappingProduct> listVMP = voucherMappingProductRepository
                            .findByVoucherId(vouchers.getVoucherId());
                    if (listVMP.size() > 0) {
                        for (VoucherMappingProduct item : listVMP) {
                            item.setStatus(false);
                            voucherMappingProductRepository.save(item);
                        }
                    }
                }
            }
            if (voucherDTO.getShippingVoucherApplied() != null) {
                Vouchers vouchers = voucherDTO.getShippingVoucherApplied();
                Double discount = data.getShipping_fee();
                InvoiceMappingVoucher iMappingVoucher = new InvoiceMappingVoucher();
                iMappingVoucher.setInvoice(invoices);
                iMappingVoucher.setVoucher(vouchers);
                iMappingVoucher.setDiscountAmount(discount);
                invoiceMappingVoucherRepository.save(iMappingVoucher);

                UserVoucher userVoucher = userVoucherRepository.findByUsernameAndVoucherAndStatus(username, vouchers,
                        true);
                userVoucher.setStatus(false);
                vouchers.setUsedQuantity(vouchers.getUsedQuantity() + 1);

                if (vouchers.getTotalQuantity() - vouchers.getUsedQuantity() <= 0) {
                    vouchers.setStatus(false);
                    List<VoucherMappingCategory> listVMC = voucherMappingCategoryRepository
                            .findByVoucherId(vouchers.getVoucherId());
                    if (listVMC.size() > 0) {
                        for (VoucherMappingCategory item : listVMC) {
                            item.setStatus(false);
                            voucherMappingCategoryRepository.save(item);
                        }
                    }
                    List<VoucherMappingProduct> listVMP = voucherMappingProductRepository
                            .findByVoucherId(vouchers.getVoucherId());
                    if (listVMP.size() > 0) {
                        for (VoucherMappingProduct item : listVMP) {
                            item.setStatus(false);
                            voucherMappingProductRepository.save(item);
                        }
                    }
                }
            }
        }
    }

    // ================================================================================================
    public boolean validVoucher(CartVoucherDTO voucherDTO) {
        if (voucherDTO != null) {
            Vouchers normalVoucher = voucherDTO.getNormalVoucherApplied();
            Vouchers shippingVoucher = voucherDTO.getShippingVoucherApplied();

            if (normalVoucher != null && !isVoucherValid(normalVoucher)) {
                return false;
            }

            if (shippingVoucher != null && !isVoucherValid(shippingVoucher)) {
                return false;
            }
        }

        return true;
    }

    // ================================================================================================

    private static boolean isVoucherValid(Vouchers voucher) {
        Date currentDate = new Date();
        int stock = voucher.getTotalQuantity() - voucher.getUsedQuantity();
        if (currentDate.before(voucher.getEndDate()) && currentDate.after(voucher.getStartDate()) && stock > 0) {
            return true;
        } else {
            return false;
        }
    }

    private Orders setDataOrders(CheckoutDTO data) {
        Orders orders = new Orders();

        String orderCode = generateOrderCode();
        while (ordersRepository.existsById(orderCode)) {
            orderCode = generateOrderCode();
        }
        
        orders.setOrderCode(orderCode);
        orders.setClientOrderCode(orderCode);
        orders.setUsername(data.getUsername());

        // Thông tin người gửi từ OrderInfo
        orders.setFromName(OrderInfo.FROM_NAME);
        orders.setFromPhone(OrderInfo.FROM_PHONE);
        orders.setFromAddress(OrderInfo.FROM_ADDRESS);
        orders.setFromWardName(OrderInfo.FROM_WARD_NAME);
        orders.setFromDistrictName(OrderInfo.FROM_DISTRICT_NAME);
        orders.setFromProvinceName(OrderInfo.FROM_PROVINCE_NAME);

        // Thông tin người nhận
        orders.setToName(data.getTo_name());
        orders.setToPhone(data.getTo_phone());
        orders.setToAddress(data.getTo_address());
        orders.setToWardCode(data.getTo_ward_code());
        orders.setToDistrictId(data.getTo_district_id());

        // Thông tin dịch vụ GHN
        orders.setServiceId(data.getService_id());
        orders.setServiceTypeId(data.getService_type_id());
        orders.setRequiredNote(OrderInfo.REQUIRED_NOTE);

        // Thông tin đơn hàng
        // trạng thái
        orders.setStatus("pending");
        // ngày tạo
        Date now = new Date();
        orders.setCreate_Date(now);
        // cân nặng
        int weight = 0;
        for (Carts item : data.getCarts()) {
            weight += item.getQuantity() * item.getProductDetail().getWeight();
        }
        orders.setWeight(weight);
        // giá trị tổng thể để có gì GHN bồi thường nếu hàng bị gì đó
        int insuranceValue = data.getPayment_total().intValue();
        orders.setInsuranceValue(insuranceValue);
        // xem ai là người trả tiền ship
        if (data.getShipping_fee() == 0) {
            orders.setPaymentTypeId(1);// cửa hàng trả
        } else {
            orders.setPaymentTypeId(2);// khách trả
            orders.setCodAmount(data.getShipping_fee().intValue());
        }
        // Nội dung đơn hàng
        StringBuilder content = new StringBuilder("");
        for (Carts cartItem : data.getCarts()) {
            Products product = cartItem.getProductDetail().getProduct();
            NumberStyleFormatter numberFormatter = new NumberStyleFormatter("#,###");
            content.append("\r\n").append(product.getProductName()).append(",")
                    .append(cartItem.getQuantity()).append("x")
                    .append(numberFormatter.print(cartItem.getPrice(), Locale.getDefault()))
                    .append(" VND,")
                    .append(numberFormatter.print(cartItem.getAmount(), Locale.getDefault()))
                    .append(" VND");
        }
        orders.setContentOrder(content.toString());
        return orders;
    }

    private String generateOrderCode() {
        String dateFormat = "ddMMyyyy";
        SimpleDateFormat sdf = new SimpleDateFormat(dateFormat);

        String currentDate = sdf.format(new Date());

        int numberLength = 4;

        String randomNumber = generateRandomNumber(numberLength);

        String orderCode = "GH" + currentDate + randomNumber;

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

}
