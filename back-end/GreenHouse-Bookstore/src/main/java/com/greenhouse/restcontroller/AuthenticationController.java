package com.greenhouse.restcontroller;

import com.greenhouse.dto.AuthenticationDTO;
import com.greenhouse.dto.AuthenticationResponse;
import com.greenhouse.dto.ErrorResponse;
import com.greenhouse.service.impl.UserDetailsServiceImpl;
import com.greenhouse.util.JwtUtil;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
@RequestMapping(value = "/api/client/")
public class AuthenticationController {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @PostMapping(path = "authenticate", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> createAuthenticationToken(@RequestBody AuthenticationDTO authenticationDTO,
            HttpServletResponse response) throws BadCredentialsException, DisabledException, IOException {

        if (authenticationDTO.getUsername() == null) {
            return ResponseEntity.status(HttpStatus.OK)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(new ErrorResponse("Vui lòng nhập tên đăng nhập!", 401));
        }
        if (authenticationDTO.getPassword() == null) {
            return ResponseEntity.status(HttpStatus.OK)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(new ErrorResponse("Vui lòng nhập mật khẩu!", 401));
        }

        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(authenticationDTO.getUsername(),
                    authenticationDTO.getPassword()));
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.OK)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(new ErrorResponse("Tên đăng nhập hoặc mật khẩu không chính xác!", 401));
        } catch (DisabledException disabledException) {
            return ResponseEntity.status(HttpStatus.OK)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(new ErrorResponse("Người dùng chưa được kích hoạt", 403));
        } catch (UsernameNotFoundException notFoundException) {
            return ResponseEntity.status(HttpStatus.OK)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(new ErrorResponse("Tài khoản không tồn tại!", 404));
        }

        final UserDetails userDetails = userDetailsService.loadUserByUsername(authenticationDTO.getUsername());
        final String jwt = jwtUtil.generateToken(userDetails.getUsername(), userDetails.getAuthorities());
        return ResponseEntity.ok(new AuthenticationResponse(jwt));
    }

}
