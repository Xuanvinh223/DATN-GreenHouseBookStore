package com.greenhouse.restcontroller.AdminRestController;

import com.greenhouse.model.Accounts;
import com.greenhouse.service.AccountsService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("*")
@RequestMapping("/rest/account")
public class RestAccountController {

    @Autowired
    private AccountsService accountsService;

    @GetMapping
    public ResponseEntity<List<Accounts>> getAllAccount() {
        List<Accounts> accountList = accountsService.findAll();
        return ResponseEntity.ok(accountList);
    }

    @GetMapping("/{username}")
    public ResponseEntity<Accounts> getAccountById(@PathVariable String username) {
        Accounts accounts = accountsService.findById(username);
        if (accounts != null) {
            return ResponseEntity.ok(accounts);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<Accounts> addAccount(@RequestBody Accounts accounts) {
        ((AccountsService) accounts).add(accounts);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PutMapping("/{username}")
    public ResponseEntity<Void> updateAccount(@PathVariable String username, @RequestBody Accounts updateAccount) {
        Accounts existingAccount = accountsService.findById(username);
        if (existingAccount != null) {
            updateAccount.setUsername(existingAccount.getUsername());
            accountsService.update(updateAccount);
            accountsService.update(updateAccount);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{username}")
    public ResponseEntity<Void> deleteAcount(@PathVariable String username) {
        Accounts accounts = accountsService.findById(username);
        if (accounts != null) {
            accountsService.delete(username);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
