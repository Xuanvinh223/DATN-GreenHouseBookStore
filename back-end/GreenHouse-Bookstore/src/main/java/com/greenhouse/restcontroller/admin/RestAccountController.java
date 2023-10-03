package com.greenhouse.restcontroller.admin;

import com.google.gson.Gson;
import com.greenhouse.model.Accounts;
import com.greenhouse.service.AccountsService;

import org.apache.commons.io.FileUtils;
import org.apache.commons.io.FilenameUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;

@RestController
@CrossOrigin("*")
@RequestMapping("/rest/accounts")
public class RestAccountController {

    @Autowired
    private AccountsService accountsService;

    @Value("${upload.path}")
    private String uploadPath;

    @GetMapping
    public ResponseEntity<List<Accounts>> getAllAccount() {
        List<Accounts> accounts = accountsService.findAll();
        return new ResponseEntity<>(accounts, HttpStatus.OK);
    }

    @GetMapping("/{username}")
    public ResponseEntity<Accounts> getAccountsById(@PathVariable("username") String username) {
        Accounts accounts = accountsService.findById(username);
        if (accounts == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } else {

            return new ResponseEntity<>(accounts, HttpStatus.OK);
        }
    }

    @PostMapping
    public ResponseEntity<Object> create(@RequestParam(value = "image", required = false) MultipartFile file,
                                         @RequestParam("AccountJson") String AccountJson) {
        if (StringUtils.isEmpty(AccountJson)) {
            return new ResponseEntity<>("Thông tin tài khoản không hợp lệ.", HttpStatus.BAD_REQUEST);
        }

        // Xử lý tải lên ảnh (nếu có)
        String uploadedFileName = null;
        if (file != null && !file.isEmpty()) {
            try {
                String originalFileName = file.getOriginalFilename();
                String fileExtension = FilenameUtils.getExtension(originalFileName);
                uploadedFileName = "Account_" + System.currentTimeMillis() + "." + fileExtension;
                File uploadedFile = new File(uploadPath + File.separator + uploadedFileName);
                FileUtils.writeByteArrayToFile(uploadedFile, file.getBytes());
            } catch (IOException e) {
                return new ResponseEntity<>("Lỗi khi tải ảnh lên.", HttpStatus.BAD_REQUEST);
            }
        }

        // Xử lý thông tin thương hiệu
        Accounts accounts = new Gson().fromJson(AccountJson, Accounts.class);

        if (uploadedFileName != null) {
            accounts.setImage(uploadedFileName);
        }

        Accounts editingAccount = accountsService.findById(accounts.getUsername());
        if (editingAccount != null) {
            return new ResponseEntity<>("Tài khoản đã tồn tại.", HttpStatus.BAD_REQUEST);
        }

        Accounts createAccounts = accountsService.add(accounts);
        return new ResponseEntity<>(createAccounts, HttpStatus.OK);
    }

    @PutMapping(value = "/{username}")
    public ResponseEntity<Accounts> update(@PathVariable("username") String username,
                                           @RequestParam(value = "image", required = false) MultipartFile file,
                                           @RequestParam("AccountJson") String AccountJson) {

        // Xử lý tải lên ảnh (nếu có)
        String uploadedFileName = null;
        if (file != null && !file.isEmpty()) {
            try {
                String originalFileName = file.getOriginalFilename();
                String fileExtension = FilenameUtils.getExtension(originalFileName);
                uploadedFileName = "Account_" + System.currentTimeMillis() + "." + fileExtension;
                File uploadedFile = new File(uploadPath + File.separator + uploadedFileName);
                FileUtils.writeByteArrayToFile(uploadedFile, file.getBytes());
            } catch (IOException e) {
                e.printStackTrace();
                return ResponseEntity.badRequest().build();
            }
        }

        // Chuyển đổi dữ liệu thương hiệu từ JSON thành đối tượng Brand
        Accounts accounts = new Gson().fromJson(AccountJson, Accounts.class);

        // Kiểm tra xem ảnh đã tải lên mới chưa
        if (uploadedFileName != null) {
            accounts.setImage(uploadedFileName);
        }

        // Cập nhật thông tin thương hiệu
        accounts.setUsername(username);

        Accounts updatedAccounts = accountsService.update(accounts);
        return ResponseEntity.ok(updatedAccounts);
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
