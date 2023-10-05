package com.greenhouse.restcontroller.client;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

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

    private static final String PASSWORD_PATTERN = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!])(?=\\S+$).{8,}$";

    private static final Pattern pattern = Pattern.compile(PASSWORD_PATTERN);

    private static final int MIN_USERNAME_LENGTH = 8;

    @PostMapping("/sign-up")
    public ResponseEntity<Response> signupUser(@RequestBody SignupDTO signupDTO) {
        Response response = new Response();
        // Kiểm tra tài khoản và mật khẩu bắt buộc
        if (isEmpty(signupDTO.getUsername()) || isEmpty(signupDTO.getPassword()) || isEmpty(signupDTO.getPhone())) {
            response.setStatus(400);
            response.setMessage("Thông tin bắt buộc chưa được điền đầy đủ.");
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }

        // So sánh mật khẩu và xác nhận mật khẩu
        if (!signupDTO.getPassword().equals(signupDTO.getRepassword())) {
            response.setStatus(400);
            response.setMessage("Mật khẩu không trùng khớp!");
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        } else if (!validatePassword(signupDTO.getPassword())) {
            response.setStatus(400);
            response.setMessage("Mật khẩu không hợp lệ.");
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }

        // Kiểm tra số điện thoại hợp lệ
        if (!isValidPhoneNumber(signupDTO.getPhone())) {
            response.setStatus(400);
            response.setMessage("Số điện thoại không hợp lệ.");
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }

        // Kiểm tra độ dài tên đăng nhập
        if (signupDTO.getUsername().length() < MIN_USERNAME_LENGTH) {
            response.setStatus(400);
            response.setMessage("Tên tài khoản phải nhiều hơn " + MIN_USERNAME_LENGTH + " kí tự.");
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }

        // Kiểm tra tên đăng nhập và số điện thoại đã tồn tại
        if (accountRepository.existsByUsername(signupDTO.getUsername())) {
            response.setStatus(400);
            response.setMessage("Tên đăng nhập đã tồn tại.");
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        } else if (accountRepository.existsByPhone(signupDTO.getPhone())) {
            response.setStatus(400);
            response.setMessage("Số điện thoại đã tồn tại.");
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }

        // Đăng ký tài khoản
        authService.signup(signupDTO);
        response.setStatus(201);
        response.setMessage("Đăng ký tài khoản thành công!");
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }


    private boolean isValidPhoneNumber(String phoneNumber) {
        // Sử dụng biểu thức chính quy để kiểm tra số điện thoại Việt Nam
        String regex = "^0[0-9]{9}$"; // Định dạng số điện thoại Việt Nam
        return phoneNumber.matches(regex);
    }

    public static boolean validatePassword(String password) {
        Matcher matcher = pattern.matcher(password);
        return matcher.matches();
    }

    public static boolean isEmpty(String str) {
        return str == null || str.trim().isEmpty();
    }
}
