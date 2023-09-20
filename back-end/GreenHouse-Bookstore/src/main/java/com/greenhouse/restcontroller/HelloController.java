package com.greenhouse.restcontroller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.greenhouse.service.TokenValidationService;

@RestController
@RequestMapping("/api")
public class HelloController {

	 @Autowired
	    private TokenValidationService tokenValidationService;

	    @GetMapping("/hello")
	    public ResponseEntity<Map<String, Object>> hello(
	            @RequestHeader(value = "Authorization", required = false) String authHeader) {
	        Map<String, Object> response = new HashMap<>();

	        boolean isTokenValid = tokenValidationService.isTokenValid(authHeader);

	        if (isTokenValid) {
	            // Xử lý khi token hợp lệ
	            response.put("message", "Authorized");
	            return ResponseEntity.ok(response);
	        } else {
	            // Xử lý khi không có hoặc token không hợp lệ
	            System.out.println("không có hoặc token không hợp lệ");
	            response.put("error", "Unauthorized");
	            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
	        }
	    }
}
