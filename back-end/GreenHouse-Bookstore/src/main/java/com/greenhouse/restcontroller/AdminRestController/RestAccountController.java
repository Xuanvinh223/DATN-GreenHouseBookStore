package com.greenhouse.restcontroller.AdminRestController;

import com.greenhouse.model.Accounts;
import com.greenhouse.service.AccountsService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("*")
@RequestMapping("/rest/accounts")
public class RestAccountController {

    @Autowired
    private AccountsService accountsService;

    @GetMapping
    public ResponseEntity<List<Accounts>> getAllAccount() {
        List<Accounts> accountList = accountsService.findAll();
        return ResponseEntity.ok(accountList);
    }

    
    @GetMapping("/{username}")
    public ResponseEntity<Accounts> getAccountsById(@PathVariable String username) {
        Accounts accounts = accountsService.findById(username);
        if (accounts != null) {
            return ResponseEntity.notFound().build();
        } else {
            
            return ResponseEntity.ok(accounts);
        }
    }

    @PostMapping
    private ResponseEntity<?> create(@RequestBody Accounts accounts) {
        // Kiểm tra nếu authorId là null hoặc rỗng thì trả về lỗi
        if (accounts.getUsername() == null || accounts.getUsername().isEmpty()) {
            return ResponseEntity.badRequest().body("Mã thương hiệu không hợp lệ.");
        }
    
        Accounts existingAccounts = accountsService.findById(accounts.getUsername());
        if (existingAccounts != null) {
            return ResponseEntity.badRequest().body("Thương hiệu đã tồn tại.");
        }

        System.out.println(accounts);
        Accounts createdAccounts = accountsService.add(accounts);

        return ResponseEntity.ok(createdAccounts);
    }

    @PutMapping("/{username}")
    public ResponseEntity<Void> updateAccounts(@PathVariable String username, @RequestBody Accounts updateAccounts) {
        Accounts existingAccounts = accountsService.findById(username);
        if (existingAccounts != null) {
            updateAccounts.setUsername(existingAccounts.getUsername());
            accountsService.update(updateAccounts);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping(value = "/{username}")
    private ResponseEntity<Void> delete(@PathVariable("username") String username) {
        Accounts existingAccounts = accountsService.findById(username);
        if (existingAccounts == null) {
            return ResponseEntity.notFound().build();
        }
        accountsService.delete(username);
        return ResponseEntity.ok().build();
    }
}
