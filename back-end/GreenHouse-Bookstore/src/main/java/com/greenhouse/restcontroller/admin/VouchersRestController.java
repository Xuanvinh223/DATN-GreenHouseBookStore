package com.greenhouse.restcontroller.admin;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.greenhouse.dto.VoucherCateCreateDTO;
import com.greenhouse.model.Categories;
import com.greenhouse.model.Product_Flash_Sale;
import com.greenhouse.model.VoucherMappingCategory;
import com.greenhouse.model.Vouchers;
import com.greenhouse.repository.CategoriesRepository;
import com.greenhouse.repository.VoucherMappingCategoryRepository;
import com.greenhouse.repository.VouchersRepository;

@RestController
@RequestMapping("/rest/vouchers")
public class VouchersRestController {

    @Autowired
    private VouchersRepository vouchersRepository;
    @Autowired
    private VoucherMappingCategoryRepository voucherMappingCategoryRepository;
    @Autowired
    private CategoriesRepository categoriesRepository;

    @GetMapping
    public ResponseEntity<List<Vouchers>> getAllVouchers() {
        List<Vouchers> vouchers = vouchersRepository.findAll();
        return new ResponseEntity<>(vouchers, HttpStatus.OK);
    }

    @GetMapping("/{voucherId}")
    public ResponseEntity<Map<String, Object>> getVouchersById(@PathVariable("voucherId") int voucherId) {
        Map<String, Object> resp = new HashMap<>();

        Vouchers vouchers = vouchersRepository.findById(voucherId);
        List<Categories> categories = new ArrayList<>();

        List<VoucherMappingCategory> listVoucherMappingCategories = voucherMappingCategoryRepository
                .findByVoucherId(voucherId);

        for (VoucherMappingCategory item : listVoucherMappingCategories) {
            Categories cate = categoriesRepository.findById(item.getCategoryId()).orElse(null);
            if (cate != null) {
                categories.add(cate);
            }
        }

        resp.put("vouchers", vouchers);
        resp.put("categories", categories);

        return ResponseEntity.ok(resp);
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> create(@RequestBody VoucherCateCreateDTO data) {

        System.out.println(data);

        Map<String, Object> resp = new HashMap<>();
        String message = "";

        Vouchers vouchers = (Vouchers) data.getVoucher();
        List<VoucherMappingCategory> categories = data.getCategories();
        List<Categories> listdeletedCategories = data.getListdeletedCategories();

        if (!listdeletedCategories.isEmpty()) {
            for (Categories item : listdeletedCategories) {
                VoucherMappingCategory vmc = voucherMappingCategoryRepository.findByVoucherIdAndCategoryId(vouchers.getVoucherId(), item.getCategoryId());
                voucherMappingCategoryRepository.delete(vmc);
            }
        }
        vouchersRepository.save(vouchers);

        List<VoucherMappingCategory> voucherMappingCategories = voucherMappingCategoryRepository
                .findByVoucherId(vouchers.getVoucherId());

        boolean isEditing = false;
        for (VoucherMappingCategory c : categories) {
            boolean duplicate = voucherMappingCategories.stream()
                    .anyMatch(vc -> vc.getCategoryId().equals(c.getCategoryId()));
            if (!duplicate) {
                isEditing = true;

                VoucherMappingCategory item = new VoucherMappingCategory();
                item.setVoucherId(vouchers.getVoucherId());
                item.setCategoryId(c.getCategoryId());

                voucherMappingCategoryRepository.save(item);
            }
        }

        message = isEditing ? "Cập nhật voucher thành công" : "Thêm voucher thành công";
        resp.put("message", message);

        return ResponseEntity.ok(resp);
    }

    @DeleteMapping(value = "/{voucherId}")
    public ResponseEntity<Void> delete(@PathVariable("voucherId") int voucherId) {
        List<VoucherMappingCategory> voucherMappingCategories = voucherMappingCategoryRepository
                .findByVoucherId(voucherId);

        for (VoucherMappingCategory v : voucherMappingCategories) {
            voucherMappingCategoryRepository.delete(v);
        }

        Vouchers existingVouchers = vouchersRepository.findById(voucherId);
        if (existingVouchers == null) {
            return ResponseEntity.notFound().build();
        }
        vouchersRepository.delete(existingVouchers);
        return ResponseEntity.ok().build();
    }

}
