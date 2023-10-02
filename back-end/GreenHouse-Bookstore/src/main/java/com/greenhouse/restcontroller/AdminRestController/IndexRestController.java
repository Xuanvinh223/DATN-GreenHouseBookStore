package com.greenhouse.restcontroller.AdminRestController;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.greenhouse.service.AccountsService;

@RestController
@CrossOrigin("*")
public class IndexRestController {

    @Autowired
    private AccountsService accountsService;

    @GetMapping("/rest/getIndexCount")
    public ResponseEntity<Map<String, Object>> getIndex() {
        Map<String, Object> resp = new HashMap<>();
        // Lấy dữ liệu từ các hàm trong AccountsService
        int countOrdersWithStatus = accountsService.countOrdersWithStatus();
        int countByBrand = accountsService.countByBrand();
        int countByCustomer = accountsService.countByCustomer();

        resp.put("countOrdersWithStatus", countOrdersWithStatus);
        resp.put("countByBrand", countByBrand);
        resp.put("countByCustomer", countByCustomer);

        return ResponseEntity.ok(resp);
    }

}
