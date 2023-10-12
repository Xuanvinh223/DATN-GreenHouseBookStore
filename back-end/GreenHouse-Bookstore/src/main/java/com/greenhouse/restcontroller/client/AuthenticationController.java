package com.greenhouse.restcontroller.client;

import com.greenhouse.dto.AuthenticationDTO;
import com.greenhouse.dto.AuthenticationResponse;
import com.greenhouse.dto.Response;
import com.greenhouse.model.Accounts;
import com.greenhouse.repository.AccountRepository;
import com.greenhouse.service.impl.UserDetailsServiceImpl;
import com.greenhouse.util.JwtUtil;

import io.micrometer.common.util.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AuthenticationController {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @Autowired
    AccountRepository repository;

    @PostMapping(path = "/authenticate", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> createAuthenticationToken(@RequestBody AuthenticationDTO authenticationDTO) {
        if (StringUtils.isBlank(authenticationDTO.getUsername())
                || StringUtils.isBlank(authenticationDTO.getPassword())) {
            return ResponseEntity.badRequest().body(new Response("Thông tin không được bỏ trống", 400));
        }

        Accounts accounts = repository.findByUsernameOrEmailOrPhone(authenticationDTO.getUsername(),
                authenticationDTO.getUsername(), authenticationDTO.getUsername());

        if (accounts == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new Response("Tài khoản không tồn tại!", 404));
        }

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(accounts.getUsername(), authenticationDTO.getPassword()));
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new Response("Tên đăng nhập hoặc mật khẩu không chính xác!", 401));
        } catch (DisabledException disabledException) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new Response("Người dùng chưa được kích hoạt", 403));
        }

        final UserDetails userDetails = userDetailsService.loadUserByUsername(accounts.getUsername());
        final String jwt = jwtUtil.generateToken(accounts, userDetails.getAuthorities());

        return ResponseEntity.ok(new AuthenticationResponse(jwt));
    }
}
