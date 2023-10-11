package com.greenhouse.controller.client;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import com.greenhouse.model.Accounts;
import com.greenhouse.model.Authorities;
import com.greenhouse.repository.AccountRepository;
import com.greenhouse.repository.AuthoritiesRepository;
import com.greenhouse.service.impl.UserDetailsServiceImpl;
import com.greenhouse.util.JwtUtil;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Controller
public class Maincontroller {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    UserDetailsServiceImpl detailsServiceImpl;

    @Autowired
    AccountRepository accountRepository;

    @Autowired
    private AuthoritiesRepository authoritiesRepository;

    @GetMapping(value = "/index")
    public String index() {
        return "client/layouts/home";
    }

    @GetMapping(value = "/contact")
    public String contact() {
        return "client/layouts/contact";
    }

    @GetMapping(value = "/voucher")
    public String voucher() {
        return "client/layouts/voucher";
    }

    @GetMapping(value = "/flash-sale")
    public String flashSale() {
        return "client/layouts/flash-sale";
    }

    @GetMapping(value = "/product")
    public String product() {
        return "client/layouts/product";
    }

    @GetMapping(value = "/product-details")
    public String productDetails() {
        return "client/layouts/product-details";
    }

    @GetMapping(value = "/account")
    public String account() {
        return "client/layouts/account";
    }

    @GetMapping(value = "/cart")
    public String cart() {
        return "client/layouts/cart";
    }

    @GetMapping(value = "/checkout")
    public String checkout() {
        return "client/layouts/checkout";
    }

    @GetMapping(value = "/checkout-complete")
    public String checkoutComplete() {
        return "client/layouts/checkout-complete";
    }

    @GetMapping(value = "/login")
    public String login() {
        return "client/layouts/login";
    }

    @GetMapping(value = "/resgister")
    public String signin() {
        return "client/layouts/signin";
    }

    @GetMapping(value = "/forgot-password")
    public String forgotPasswrod() {
        return "client/layouts/forgot-password";
    }

    @GetMapping("/404")
    public String accessDenied() {
        return "client/layouts/404"; // Chuyển hướng đến trang 403
    }

    @GetMapping("/google-processing")
    public String googleProcessing(OAuth2AuthenticationToken authenticationToken, HttpServletRequest request,
                                   HttpServletResponse response) {
        // Lấy thông tin tài khoản Google đã đăng nhập từ authenticationToken
        OAuth2User oauth2User = authenticationToken.getPrincipal();
        Accounts accounts = new Accounts();
        Authorities authorities = new Authorities();

        String username = oauth2User.getAttribute("sub");
        String fullname = oauth2User.getAttribute("name");
        String image = oauth2User.getAttribute("picture");
        String email = oauth2User.getAttribute("email");

        // Kiểm tra xem tài khoản đã tồn tại trong cơ sở dữ liệu chưa
        Accounts existingAccount = accountRepository.findByUsername(username);

        if (existingAccount == null) {
            accounts.setUsername(username);
            accounts.setPassword(new BCryptPasswordEncoder().encode(username));
            accounts.setFullname(fullname);
            accounts.setImage(image);
            accounts.setEmail(email);

            accountRepository.save(accounts);

            authorities.setUsername(accounts.getUsername());
            authorities.setRoleId(3);
            authoritiesRepository.save(authorities);
        }

        List<Authorities> listAuthorities = authoritiesRepository.findByUsername(username);
        List<GrantedAuthority> authoritiesList = listAuthorities.stream()
                .map(authority -> new SimpleGrantedAuthority("ROLE_" + authority.getRole().getRole()))
                .collect(Collectors.toList());
        final String jwt = jwtUtil.generateToken(username, fullname, authoritiesList);

        Cookie cookie = new Cookie("token", jwt);
        cookie.setMaxAge(3600);
        cookie.setPath("/");
        response.addCookie(cookie);
        return "redirect:/index";
    }
}
