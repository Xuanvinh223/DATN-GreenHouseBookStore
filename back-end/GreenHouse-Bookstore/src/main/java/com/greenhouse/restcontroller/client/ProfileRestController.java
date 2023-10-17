package com.greenhouse.restcontroller.client;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.greenhouse.model.Address;
import com.greenhouse.repository.AccountRepository;
import com.greenhouse.repository.AddressRepository;

@CrossOrigin("*")
@RestController
public class ProfileRestController {

    @Autowired
    AccountRepository acc;

    @Autowired
    AddressRepository addressRepository;

    @GetMapping("/rest/address/{username}")
    public ResponseEntity<Map<String, Object>> getAddressByUsername(@PathVariable String username) {
        List<Optional<Address>> addresses = addressRepository.findByUsername(username);
        Map<String, Object> response = new HashMap<>();

        List<Address> addressList = new ArrayList<>();
        addresses.forEach(optional -> optional.ifPresent(addressList::add));

        response.put("success", !addressList.isEmpty());
        response.put("listAddress", addressList);

        return ResponseEntity.ok(response);
    }

}
