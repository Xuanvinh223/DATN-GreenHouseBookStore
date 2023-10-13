package com.greenhouse.configuration;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.greenhouse.filters.JwtRequestFilter;

@Configuration
@EnableWebSecurity
public class WebSecurityConfiguration {

    @Autowired
    private JwtRequestFilter requestFilter;

    private final String[] apiEndpoints = { "/rest/**" }; // Danh sách các API bảo mật
    private final String[] apiEndpointsPermit = {"/authenticate", "/resgister", "/index", "/login", "/404", "/sign-up",
            "/account", "/contact", "/voucher", "/flash-sale", "/product", "/product-details", "/cart", "/checkout",
            "/checkout-complete", "/forgot-password", "/customer/**", "/client/**", "/admin/**"}; // Danh sách các API cho phép truy cập

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http.csrf().disable() // Vô hiệu hóa CSRF protection, có thể cần bật trong môi trường thực tế
                .authorizeHttpRequests() // Bắt đầu cấu hình xác thực và phân quyền cho các yêu cầu HTTP
                .requestMatchers(apiEndpointsPermit) // Các URL không cần xác thực
                .permitAll().and()// Cho phép tất cả mọi người truy cập các URL trên mà không cần xác thực
                .authorizeHttpRequests() // Cấu hình phân quyền cho các yêu cầu khác
                .requestMatchers(apiEndpoints) // Các URL trong danh sách `apiEndpoints` cần xác thực
                .hasRole("ADMIN").and() // Yêu cầu xác thực cho các URL trong `apiEndpoints`
                .exceptionHandling() // Xử lý ngoại lệ trong quá trình xác thực
                .accessDeniedPage("/404") // Trang chuyển hướng khi người dùng không có quyền truy cập
                .and().sessionManagement() // Cấu hình quản lý phiên làm việc
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS) // Sử dụng phiên làm việc không lưu trữ trạng
                // thái
                .and().addFilterBefore(requestFilter, UsernamePasswordAuthenticationFilter.class)// Thêm bộ lọc trước
                // UsernamePasswordAuthenticationFilter`
                .build(); // Kết thúc cấu hình và trả về một SecurityFilterChain
    }

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

}
