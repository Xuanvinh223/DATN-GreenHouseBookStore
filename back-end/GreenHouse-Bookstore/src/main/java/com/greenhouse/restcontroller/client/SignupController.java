package com.greenhouse.restcontroller.client;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.greenhouse.dto.Response;
import com.greenhouse.dto.SignupDTO;
import com.greenhouse.repository.AccountRepository;
import com.greenhouse.service.AuthService;

@RestController
public class SignupController {

    @Autowired
    private AuthService authService;

    @Autowired
    private AccountRepository accountRepository;

    @PostMapping("/sign-up")
    public ResponseEntity<Response> signupUser(@RequestBody SignupDTO signupDTO) {
        Response response = new Response();

        System.out.println(signupDTO);

        if (signupDTO.getUsername() == null || signupDTO.getUsername().isEmpty() ||
                signupDTO.getPassword() == null || signupDTO.getPassword().isEmpty()) {
            // Nếu có trường thông tin bắt buộc chưa được điền đầy đủ, trả về lỗi
            response.setStatus(400);
            response.setMessage("Thông tin bắt buộc chưa được điền đầy đủ.");
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        } else if (!signupDTO.getPassword().equals(signupDTO.getRepassword())) {
            response.setStatus(400);
            response.setMessage("Mật khẩu không trùng khớp!");
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        } else if (!isValidPhoneNumber(signupDTO.getPhone())) {
            // Kiểm tra số điện thoại
            response.setStatus(400);
            response.setMessage("Số điện thoại không hợp lệ.");
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }

        if (accountRepository.existsByUsername(signupDTO.getUsername())) {
            // Xử lý lỗi tên đăng nhập đã tồn tại
            response.setStatus(400);
            response.setMessage("Tên đăng nhập đã tồn tại.");
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        } else if (accountRepository.existsByPhone(signupDTO.getPhone())) {
            // Xử lý lỗi SDT đã tồn tại
            response.setStatus(400);
            response.setMessage("Số điện thoại đã tồn tại.");
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        } else {
            authService.signup(signupDTO);
            response.setStatus(201);
            response.setMessage("Đăng ký tài khoản thành công!");
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        }
    }

    private boolean isValidPhoneNumber(String phoneNumber) {
        // Sử dụng biểu thức chính quy để kiểm tra số điện thoại Việt Nam
        String regex = "^0[0-9]{9}$"; // Định dạng số điện thoại Việt Nam
        return phoneNumber.matches(regex);
    }

}
