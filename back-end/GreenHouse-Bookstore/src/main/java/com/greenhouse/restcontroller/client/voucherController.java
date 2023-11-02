package com.greenhouse.restcontroller.client;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.greenhouse.model.Vouchers;
import com.greenhouse.repository.VouchersRepository;

@RestController
@RequestMapping("/customer/rest/voucher")
public class voucherController {

    @Autowired
    VouchersRepository vouchersRepository;

    @GetMapping("/list-vouchers")
    public ResponseEntity<Map<String, Object>> getVouchers() {
        Map<String, Object> response = new HashMap<>();

        List<Vouchers> listActiveVouchers = vouchersRepository.findActiveVouchers();

        List<Vouchers> listVouchersProduct = new ArrayList<>();
        List<Vouchers> listVouchersTypeProduct = new ArrayList<>();
        List<Vouchers> listVouchersShip = new ArrayList<>();

        for (Vouchers vouchers : listActiveVouchers) {
            if (vouchers.getVoucherType().equals("Ship")) {
                listVouchersShip.add(vouchers);
            } else if (vouchers.getVoucherType().equals("Sản phẩm")) {
                listVouchersProduct.add(vouchers);
            } else {
                listVouchersTypeProduct.add(vouchers);
            }
        }

        response.put("listVouchersProduct", listVouchersProduct);
        response.put("listVouchersTypeProduct", listVouchersTypeProduct);
        response.put("listVouchersShip", listVouchersShip);

        return ResponseEntity.ok(response);
    }
}
