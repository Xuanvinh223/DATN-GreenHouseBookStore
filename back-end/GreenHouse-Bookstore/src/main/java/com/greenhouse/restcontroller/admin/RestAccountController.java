package com.greenhouse.restcontroller.admin;

import com.google.gson.Gson;
import com.greenhouse.model.Accounts;
import com.greenhouse.service.AccountsService;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin("*")
@RequestMapping("/rest/accounts")
public class RestAccountController {

    @Autowired
    private AccountsService accountsService;

    @Value("${upload.path}")
    private String uploadPath;

    private static final String CLOUDINARY_CLOUD_NAME = "dmbh3sz8s";
    private static final String CLOUDINARY_API_KEY = "165312227781173";
    private static final String CLOUDINARY_API_SECRET = "xcADjr7hxF6iXNMtsdf2CQAnbOI";

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


        String photoUrl = null;
        if (file != null && !file.isEmpty()) {
            try {
                photoUrl = uploadImageToCloudinary(file, "Account_" + System.currentTimeMillis());
            } catch (Exception e) {
                e.printStackTrace();
                return new ResponseEntity<>("Lỗi khi tải ảnh lên Cloudinary.", HttpStatus.BAD_REQUEST);
            }
        }

        Accounts accounts = new Gson().fromJson(AccountJson, Accounts.class);

        if (photoUrl != null) {
            accounts.setImage(photoUrl);
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

        String photoUrl = null;
        if (file != null && !file.isEmpty()) {
            try {
                photoUrl = uploadImageToCloudinary(file, "Account_" + System.currentTimeMillis());
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        Accounts accounts = new Gson().fromJson(AccountJson, Accounts.class);

        if (photoUrl != null) {
            accounts.setImage(photoUrl);
        }

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

    private String uploadImageToCloudinary(MultipartFile imageFile, String imageName) throws Exception {
        String photoUrl = null;

        try {
            Cloudinary cloudinary = new Cloudinary(ObjectUtils.asMap(
                    "cloud_name", CLOUDINARY_CLOUD_NAME,
                    "api_key", CLOUDINARY_API_KEY,
                    "api_secret", CLOUDINARY_API_SECRET));

            byte[] imageBytes = imageFile.getBytes();

            Map uploadResult = cloudinary.uploader().upload(imageBytes, ObjectUtils.asMap(
                    "public_id", imageName,
                    "folder", "accounts",
                    "overwrite", true
            ));

            photoUrl = (String) uploadResult.get("secure_url");
        } catch (IOException e) {
            e.printStackTrace();
            throw new Exception("Lỗi khi tải ảnh lên Cloudinary.");
        }

        return photoUrl;
    }
}
