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
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.greenhouse.model.Accounts;
import com.greenhouse.model.Address;
import com.greenhouse.repository.AccountRepository;
import com.greenhouse.repository.AddressRepository;

@CrossOrigin("*")
@RestController
@RequestMapping("/customer")
public class ProfileRestController {

    @Autowired
    AccountRepository acc;

    @Autowired
    AddressRepository addressRepository;

    @Autowired
    AccountRepository accountRepository;

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

    @GetMapping("/rest/profile_address/{id}")
    public ResponseEntity<Optional<Address>> getOne(@PathVariable("id") Integer id) {
        if (addressRepository.findById(id) == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(addressRepository.findById(id));
    }

    @PostMapping("/rest/profile_address")
    public ResponseEntity<Address> createAddress(@RequestBody Address reqAddress) {
        Address address = addressRepository.save(reqAddress);
        return new ResponseEntity<>(address, HttpStatus.CREATED);
    }

    @DeleteMapping("/rest/profile_address/{id}")
    public ResponseEntity<Void> deleteAddress(@PathVariable("id") Integer id) {
        Optional<Address> address = addressRepository.findById(id);
        if (!address.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        addressRepository.delete(address.get());
        return ResponseEntity.noContent().build();
    }

    // ACCOUNT
    @GetMapping("/rest/profile_account/{username}")
    public ResponseEntity<Accounts> getAccountfindByUsername(@PathVariable String username) {
        return ResponseEntity.ok(acc.findByUsername(username));
    }

    @PostMapping("/rest/profile_account")
    public ResponseEntity<Accounts> updateAccount(@RequestBody Accounts newAccount) {
        // Lấy thông tin tài khoản hiện tại từ cơ sở dữ liệu
        Accounts existingAccount = accountRepository.findByUsername(newAccount.getUsername());

        if (existingAccount != null) {
            // Cập nhật các thuộc tính (trừ mật khẩu)
            existingAccount.setFullname(newAccount.getFullname());
            existingAccount.setEmail(newAccount.getEmail());
            existingAccount.setGender(newAccount.getGender());
            existingAccount.setBirthday(newAccount.getBirthday());
            existingAccount.setPhone(newAccount.getPhone());
            existingAccount.setImage(newAccount.getImage());
            existingAccount.setActive(newAccount.getActive());
            existingAccount.setCreatedAt(newAccount.getCreatedAt());
            existingAccount.setDeletedAt(newAccount.getDeletedAt());
            existingAccount.setDeletedBy(newAccount.getDeletedBy());

            // Lưu thông tin tài khoản đã được cập nhật vào cơ sở dữ liệu
            accountRepository.save(existingAccount);

            return new ResponseEntity<>(existingAccount, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }


}
