package com.greenhouse.restcontroller.client;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.greenhouse.dto.ChangePasswordDTO;
import com.greenhouse.dto.Response;
import com.greenhouse.model.Accounts;
import com.greenhouse.repository.AccountRepository;
import com.greenhouse.service.EmailService;
import com.greenhouse.util.JwtTokenEmail;

@RestController
@RequestMapping("/customer/rest/forgot-password")
public class forgotPasswordController {
    @Autowired
    AccountRepository accountRepository;

    @Autowired
    JwtTokenEmail jwtTokenEmail;

    @Autowired
    EmailService sendEmail;

    @PostMapping()
    public ResponseEntity<Response> sendConfirmationCode(@RequestBody ChangePasswordDTO dto) {
        Response response = new Response();
        String subject = "GreenHouse | Thay đổi mật khẩu";
        Accounts account = accountRepository.findByEmail(dto.getEmail());
        if (dto.getEmail().isEmpty()) {
            response.setStatus(400);
            response.setMessage("Thông tin không được bỏ trống!.");
            return ResponseEntity.status(response.getStatus()).body(response);
        }

        if (account == null) {
            response.setStatus(400);
            response.setMessage("Tài khoản không tồn tại!.");
            return ResponseEntity.status(response.getStatus()).body(response);
        }
        try {
            sendEmail.sendEmailFogotPassword(account.getEmail(), subject, createAndSendToken(account.getEmail()));
            response.setStatus(200);
        } catch (Exception e) {
            e.printStackTrace();
        }

        return ResponseEntity.status(response.getStatus()).body(response);
    }

    public String createAndSendToken(String email) {
        String token = jwtTokenEmail.generateToken(email);
        return token;
    }
}
