package com.greenhouse.restcontroller.admin;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.greenhouse.repository.AccountRepository;
import com.greenhouse.repository.AuthoritiesRepository;
import com.greenhouse.repository.BrandRepository;
import com.greenhouse.repository.OrderMappingStatusRepository;
import com.greenhouse.repository.OrdersRepository;

@RestController
@CrossOrigin("*")
public class IndexRestController {

    @Autowired
    private AccountRepository accountRepository;
    @Autowired
    private BrandRepository brandRepository;
    @Autowired
    private AuthoritiesRepository authoritiesRepository;
    @Autowired
    private OrdersRepository ordersRepository;
    @Autowired
    private OrderMappingStatusRepository orderMappingStatusRepository;

    @GetMapping("/rest/getIndexCount")
    public ResponseEntity<Map<String, Object>> getIndex() {
        Map<String, Object> resp = new HashMap<>();

        long countBrand = brandRepository.count();
        long countCustomer = authoritiesRepository.countByRoleId(Long.valueOf(3));

        resp.put("countBrand", countBrand);
        resp.put("countCustomer", countCustomer);

        return ResponseEntity.ok(resp);
    }

}
 